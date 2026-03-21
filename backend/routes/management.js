const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/database");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/management/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Get all management
router.get("/", async (req, res) => {
  try {
    const { region } = req.query;
    let query = "SELECT id, name, position, bio, image, social_links, region, last_modified_by, created_at, updated_at, last_modified_at FROM management";
    const params = [];

    if (region && region !== "all") {
      query += ` WHERE region = ? OR region = 'both'`;
      params.push(region);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one member
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, position, bio, image, social_links, region, last_modified_by, created_at, updated_at, last_modified_at FROM management WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Management member not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create member
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, position, bio, social_links, region } = req.body;
    const image = req.file ? req.file.filename : null;
    const socialLinksJson = social_links ? JSON.parse(social_links) : null;
    const memberRegion = region || 'both';

    const [result] = await db.query(
      "INSERT INTO management (name, position, bio, image, social_links, region) VALUES (?, ?, ?, ?, ?, ?)",
      [name, position, bio, image, JSON.stringify(socialLinksJson), memberRegion]
    );

    res.json({
      id: result.insertId,
      message: "Management member created successfully",
      management: {
        id: result.insertId,
        name,
        position,
        bio,
        image,
        social_links: socialLinksJson,
        region: memberRegion
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update member
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, bio, social_links, region } = req.body;

    const [rows] = await db.query("SELECT id, name, position, bio, image, social_links, region, last_modified_by, created_at, updated_at, last_modified_at FROM management WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Management member not found" });

    let image = rows[0].image;
    if (req.file) image = req.file.filename;

    const socialLinksJson = social_links
      ? JSON.parse(social_links)
      : rows[0].social_links;

    await db.query(
      "UPDATE management SET name = ?, position = ?, bio = ?, image = ?, social_links = ?, region = ? WHERE id = ?",
      [name, position, bio, image, JSON.stringify(socialLinksJson), region ?? rows[0].region, id]
    );

    res.json({ message: "Management member updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete member
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM management WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Management member not found" });
    res.json({ message: "Management member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
