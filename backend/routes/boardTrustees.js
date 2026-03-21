const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/database");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/board-trustees/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "trustee-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 5MB." });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Get all board trustees
router.get("/", async (req, res) => {
  try {
    const { region } = req.query;
    let query = "SELECT id, name, position, bio, image, social_links, region, last_modified_by, created_at, updated_at, last_modified_at FROM board_trustees";
    const params = [];

    if (region && region !== "all") {
      query += ` WHERE region = ? OR region = 'both'`;
      params.push(region);
    }

    query += " ORDER BY created_at DESC";

    const [results] = await db.query(query, params);

    const trusteesWithParsedLinks = results.map((trustee) => {
      try {
        trustee.social_links = trustee.social_links
          ? typeof trustee.social_links === "string"
            ? JSON.parse(trustee.social_links)
            : trustee.social_links
          : {};
      } catch (parseError) {
        console.error("Error parsing social_links:", parseError);
        trustee.social_links = {};
      }
      return trustee;
    });

    res.json(trusteesWithParsedLinks);
  } catch (err) {
    console.error("Database error fetching trustees:", err);
    res.status(500).json({
      error: "Failed to fetch board trustees",
      details: err.message,
    });
  }
});

// Get single trustee
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query(
      "SELECT id, name, position, bio, image, social_links, region, last_modified_by, created_at, updated_at, last_modified_at FROM board_trustees WHERE id = ?",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Trustee not found" });
    }

    const trustee = results[0];
    try {
      trustee.social_links = trustee.social_links
        ? typeof trustee.social_links === "string"
          ? JSON.parse(trustee.social_links)
          : trustee.social_links
        : {};
    } catch (parseError) {
      console.error("Error parsing social_links:", parseError);
      trustee.social_links = {};
    }

    res.json(trustee);
  } catch (err) {
    console.error("Database error fetching trustee:", err);
    res.status(500).json({
      error: "Failed to fetch trustee",
      details: err.message,
    });
  }
});

// Create trustee
router.post(
  "/",
  upload.single("image"),
  handleMulterError,
  async (req, res) => {
    try {
      const { name, position, bio, social_links, region } = req.body;
      const image = req.file ? req.file.filename : null;

      if (!name || name.trim() === "") {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: "Name is required" });
      }

      let socialLinksJson = {};
      try {
        if (social_links && social_links.trim() !== "") {
          socialLinksJson = JSON.parse(social_links);
        }
      } catch (parseError) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          error: "Invalid social links format",
          details: "Use valid JSON format for social links",
        });
      }

      const trusteeRegion = region || 'both';

      const [result] = await db.query(
        "INSERT INTO board_trustees (name, position, bio, image, social_links, region) VALUES (?, ?, ?, ?, ?, ?)",
        [
          name.trim(),
          position?.trim() || null,
          bio?.trim() || null,
          image,
          JSON.stringify(socialLinksJson),
          trusteeRegion,
        ]
      );

      const createdTrustee = {
        id: result.insertId,
        name: name.trim(),
        position: position?.trim() || null,
        bio: bio?.trim() || null,
        image: image,
        social_links: socialLinksJson,
        region: trusteeRegion,
      };

      res.status(201).json({
        message: "Board trustee created successfully",
        trustee: createdTrustee,
      });
    } catch (err) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Database error creating trustee:", err);
      res.status(500).json({
        error: "Failed to create trustee",
        details: err.message,
      });
    }
  }
);

// Update trustee
router.put(
  "/:id",
  upload.single("image"),
  handleMulterError,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, position, bio, social_links, region } = req.body;

      const [existingRows] = await db.query(
        "SELECT id, name, position, bio, image, social_links, region, last_modified_by, created_at, updated_at, last_modified_at FROM board_trustees WHERE id = ?",
        [id]
      );
      if (existingRows.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ error: "Trustee not found" });
      }

      const existingTrustee = existingRows[0];
      const image = req.file ? req.file.filename : existingTrustee.image;

      let socialLinksJson;
      try {
        if (social_links && social_links.trim() !== "") {
          socialLinksJson = JSON.parse(social_links);
        } else {
          socialLinksJson =
            typeof existingTrustee.social_links === "string"
              ? JSON.parse(existingTrustee.social_links)
              : existingTrustee.social_links;
        }
      } catch (parseError) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          error: "Invalid social links format",
          details: "Use valid JSON format for social links",
        });
      }

      const [result] = await db.query(
        "UPDATE board_trustees SET name = ?, position = ?, bio = ?, image = ?, social_links = ?, region = ? WHERE id = ?",
        [
          name?.trim() || existingTrustee.name,
          position?.trim() || existingTrustee.position,
          bio?.trim() || existingTrustee.bio,
          image,
          JSON.stringify(socialLinksJson),
          region ?? existingTrustee.region,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ error: "Trustee not found" });
      }

      if (req.file && existingTrustee.image) {
        const oldImagePath = path.join(
          "uploads/board-trustees/",
          existingTrustee.image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      res.json({
        message: "Trustee updated successfully",
        trustee: {
          id: parseInt(id),
          name: name?.trim() || existingTrustee.name,
          position: position?.trim() || existingTrustee.position,
          bio: bio?.trim() || existingTrustee.bio,
          image: image,
          social_links: socialLinksJson,
          region: region ?? existingTrustee.region,
        },
      });
    } catch (err) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Database error updating trustee:", err);
      res.status(500).json({
        error: "Failed to update trustee",
        details: err.message,
      });
    }
  }
);

// Delete trustee
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      "SELECT id, name, position, bio, image, social_links, last_modified_by, created_at, updated_at, last_modified_at FROM board_trustees WHERE id = ?",
      [id]
    );
    if (existingRows.length === 0) {
      return res.status(404).json({ error: "Trustee not found" });
    }

    const existingTrustee = existingRows[0];

    const [result] = await db.query("DELETE FROM board_trustees WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Trustee not found" });
    }

    if (existingTrustee.image) {
      const imagePath = path.join(
        "uploads/board-trustees/",
        existingTrustee.image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      message: "Trustee deleted successfully",
      deletedId: id,
    });
  } catch (err) {
    console.error("Database error deleting trustee:", err);
    res.status(500).json({
      error: "Failed to delete trustee",
      details: err.message,
    });
  }
});

module.exports = router;
