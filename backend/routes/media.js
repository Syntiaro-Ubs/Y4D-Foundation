// ---------- IMPORTS ----------
const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/database");
const fs = require("fs").promises;
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// ---------- MEDIA TABLE DEFINITIONS ----------
const mediaTables = {
  newsletters: {
    fields: [
      "title",
      "description",
      "file_path",
      "published_date",
      "is_published"
    ],
    fileFields: ["file_path"]
  },
  stories: {
    fields: [
      "title",
      "content",
      "image",
      "author",
      "published_date",
      "is_published"
    ],
    fileFields: ["image"]
  },
  events: {
    fields: [
      "title",
      "description",
      "date",
      "time",
      "location",
      "image",
      "published_date",
      "is_published"
    ],
    fileFields: ["image"]
  },
  blogs: {
    fields: [
      "title",
      "content",
      "image",
      "author",
      "tags",
      "published_date",
      "is_published"
    ],
    fileFields: ["image"]
  },
  documentaries: {
    fields: [
      "title",
      "description",
      "video_url",
      "video_filename",
      "thumbnail",
      "duration",
      "published_date",
      "is_published"
    ],
    fileFields: ["video_filename", "thumbnail"]
  }
};

const isValidMediaType = (type) => mediaTables.hasOwnProperty(type);

// ---------- BUILD DYNAMIC COLUMN LIST ----------
function getSelectColumns(type, alias = "m") {
  const prefix = alias ? `${alias}.` : '';
  return [
    `${prefix}id`,
    ...mediaTables[type].fields.map((f) => `${prefix}${f}`),
    `${prefix}region`,
    `${prefix}created_at`,
    `${prefix}updated_at`,
    `${prefix}last_modified_by`,
    `${prefix}last_modified_at`
  ].join(", ");
}

// ---------- MULTER UPLOAD CONFIG ----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = req.params.type;
    const uploadPath = `uploads/media/${type}/`;
    fs.mkdir(uploadPath, { recursive: true })
      .then(() => cb(null, uploadPath))
      .catch((err) => cb(err));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
}).any();

// --------------------------------------------------
//   GET ALL PUBLISHED — FRONTEND
// --------------------------------------------------
router.get("/published/:type", async (req, res) => {
  const { type } = req.params;
  const { region } = req.query;
  if (!isValidMediaType(type)) return res.status(400).json({ error: "Invalid media type" });

  try {
    const columns = getSelectColumns(type, "m");

    let query = `
      SELECT ${columns}, u.username AS last_modified_by_name
      FROM ${type} m
      LEFT JOIN users u ON m.last_modified_by = u.id
      WHERE m.is_published = TRUE
    `;
    const params = [];

    if (region && region !== "all") {
      query += ` AND (m.region = ? OR m.region = 'both')`;
      params.push(region);
    }

    query += ` ORDER BY m.created_at DESC`;

    const [results] = await db.query(query, params);
    res.json(results);

  } catch (error) {
    console.error(`Error fetching published ${type}:`, error);
    res.status(500).json({ error: "Failed to fetch published items" });
  }
});

// --------------------------------------------------
//   GET ALL ITEMS — ADMIN
// --------------------------------------------------
router.get("/:type", authenticateToken, async (req, res) => {
  const { type } = req.params;
  const { region } = req.query;
  if (!isValidMediaType(type)) return res.status(400).json({ error: "Invalid media type" });

  try {
    const columns = getSelectColumns(type, "m");
    let query;
    let params = [];

    if (["admin", "super_admin"].includes(req.user.role)) {
      query = `
        SELECT ${columns}, u.username AS last_modified_by_name
        FROM ${type} m
        LEFT JOIN users u ON m.last_modified_by = u.id
        WHERE 1=1
      `;
    } else {
      query = `
        SELECT ${columns}
        FROM ${type} m
        WHERE (m.last_modified_by = ? OR m.is_published = TRUE)
      `;
      params = [req.user.id];
    }

    if (region && region !== "all") {
      query += ` AND (m.region = ? OR m.region = 'both')`;
      params.push(region);
    }

    query += ` ORDER BY m.created_at DESC`;

    const [results] = await db.query(query, params);
    res.json(results);

  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});


// --------------------------------------------------
//   GET SINGLE ITEM
// --------------------------------------------------
router.get("/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  if (!isValidMediaType(type)) return res.status(400).json({ error: "Invalid media type" });

  try {
    const columns = getSelectColumns(type, "m");

    const query = `
      SELECT ${columns}, u.username AS last_modified_by_name
      FROM ${type} m
      LEFT JOIN users u ON m.last_modified_by = u.id
      WHERE m.id = ?
    `;

    const [results] = await db.query(query, [id]);

    if (results.length === 0)
      return res.status(404).json({ error: "Item not found" });

    res.json(results[0]);

  } catch (error) {
    console.error(`Error fetching ${type} item:`, error);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});


// --------------------------------------------------
//   CREATE ITEM
// --------------------------------------------------
router.post("/:type", authenticateToken, upload, async (req, res) => {
  const { type } = req.params;

  if (!isValidMediaType(type))
    return res.status(400).json({ error: "Invalid media type" });

  try {
    const body = req.body;
    const files = req.files || [];
    const imageFile = files.find((f) => f.fieldname === "image");
    const fileFile = files.find((f) => f.fieldname === "file");
    const videoFile = files.find((f) => f.fieldname === "video_file");

    let fields = [];
    let values = [];

    const itemRegion = body.region || 'both';

    // ----- Handle Different Types -----
    switch (type) {
      case "newsletters":
        if (!fileFile)
          return res.status(400).json({ error: "PDF file required" });

        fields = mediaTables.newsletters.fields.concat(["region", "last_modified_by"]);
        values = [
          body.title,
          body.description,
          fileFile.filename,
          body.published_date || new Date().toISOString().split("T")[0],
          body.publish_type === "schedule" ? false : true,
          itemRegion,
          req.user.id
        ];
        break;

      case "stories":
        fields = mediaTables.stories.fields.concat(["region", "last_modified_by"]);
        values = [
          body.title,
          body.content || "",
          imageFile ? imageFile.filename : null,
          body.author || "Anonymous",
          body.published_date || new Date().toISOString().split("T")[0],
          body.publish_type === "schedule" ? false : true,
          itemRegion,
          req.user.id
        ];
        break;

      case "events":
        fields = mediaTables.events.fields.concat(["region", "last_modified_by"]);
        values = [
          body.title,
          body.description,
          body.date,
          body.time,
          body.location,
          imageFile ? imageFile.filename : null,
          body.published_date || new Date().toISOString().split("T")[0],
          body.publish_type === "schedule" ? false : true,
          itemRegion,
          req.user.id
        ];
        break;

      case "blogs":
        const tagsJson = body.tags ? JSON.stringify(JSON.parse(body.tags)) : "[]";
        
        // Handle multiple images for blogs
        const blogImages = files
          .filter((f) => f.fieldname === "image")
          .map((f) => f.filename);
        
        const blogImagesJson = JSON.stringify(blogImages);

        fields = mediaTables.blogs.fields.concat(["region", "last_modified_by"]);
        values = [
          body.title,
          body.content,
          blogImagesJson, // Store as JSON array
          body.author,
          tagsJson,
          body.published_date,
          body.publish_type === "schedule" ? false : true,
          itemRegion,
          req.user.id
        ];
        break;

      case "documentaries":
        fields = mediaTables.documentaries.fields.concat(["region", "last_modified_by"]);
        values = [
          body.title,
          body.description,
          body.video_url,
          videoFile ? videoFile.filename : null,
          imageFile ? imageFile.filename : null,
          body.duration,
          body.published_date,
          body.publish_type === "schedule" ? false : true,
          itemRegion,
          req.user.id
        ];
        break;
    }

    // Build query dynamically
    const placeholders = fields.map(() => "?").join(", ");
    const query = `INSERT INTO ${type} (${fields.join(", ")}) VALUES (${placeholders})`;

    const [result] = await db.query(query, values);

    res.json({
      id: result.insertId,
      message: `${type.slice(0, -1)} created successfully`
    });

  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    res.status(500).json({ error: "Failed to create item" });
  }
});


// --------------------------------------------------
//   UPDATE ITEM
// --------------------------------------------------
router.put("/:type/:id", authenticateToken, upload, async (req, res) => {
  const { type, id } = req.params;
  if (!isValidMediaType(type)) return res.status(400).json({ error: "Invalid media type" });

  try {
    // Select full column list instead of *
    const columns = getSelectColumns(type, "");
    const [rows] = await db.query(`SELECT ${columns} FROM ${type} WHERE id = ?`, [id]);

    if (rows.length === 0)
      return res.status(404).json({ error: "Item not found" });

    const existing = rows[0];
    const body = req.body;
    const files = req.files || [];

    const imageFile = files.find((f) => f.fieldname === "image");
    const fileFile = files.find((f) => f.fieldname === "file");
    const videoFile = files.find((f) => f.fieldname === "video_file");

    let updates = [];
    let values = [];

    // ------- Switch by Type -------
    switch (type) {
      case "newsletters":
        updates = [
          "title = ?",
          "description = ?",
          "file_path = ?",
          "published_date = ?",
          "is_published = ?",
          "region = ?",
          "last_modified_by = ?",
          "last_modified_at = CURRENT_TIMESTAMP"
        ];
        values = [
          body.title,
          body.description,
          fileFile ? fileFile.filename : existing.file_path,
          body.published_date,
          body.is_published,
          body.region ?? existing.region,
          req.user.id,
          id
        ];
        break;

      case "stories":
        updates = [
          "title = ?",
          "content = ?",
          "image = ?",
          "author = ?",
          "published_date = ?",
          "is_published = ?",
          "region = ?",
          "last_modified_by = ?",
          "last_modified_at = CURRENT_TIMESTAMP"
        ];
        values = [
          body.title,
          body.content,
          imageFile ? imageFile.filename : existing.image,
          body.author || "Anonymous",
          body.published_date,
          body.is_published,
          body.region ?? existing.region,
          req.user.id,
          id
        ];
        break;

      case "events":
        updates = [
          "title = ?",
          "description = ?",
          "date = ?",
          "time = ?",
          "location = ?",
          "image = ?",
          "published_date = ?",
          "is_published = ?",
          "region = ?",
          "last_modified_by = ?",
          "last_modified_at = CURRENT_TIMESTAMP"
        ];
        values = [
          body.title,
          body.description,
          body.date,
          body.time,
          body.location,
          imageFile ? imageFile.filename : existing.image,
          body.published_date,
          body.is_published,
          body.region ?? existing.region,
          req.user.id,
          id
        ];
        break;

      case "blogs":
        let imagesArray = [];
        try {
          imagesArray = JSON.parse(existing.image || "[]");
          if (!Array.isArray(imagesArray)) {
            imagesArray = existing.image ? [existing.image] : [];
          }
        } catch (e) {
          imagesArray = existing.image ? [existing.image] : [];
        }

        // Handle existing images passed from frontend (for deletion support)
        if (body.existing_images) {
          const keptImages = JSON.parse(body.existing_images);
          // Delete files that were removed
          const removedImages = imagesArray.filter(img => !keptImages.includes(img));
          for (const img of removedImages) {
            const filePath = `uploads/media/blogs/${img}`;
            await fs.unlink(filePath).catch(() => { });
          }
          imagesArray = keptImages;
        }

        // Add new uploaded images
        const newImages = files
          .filter((f) => f.fieldname === "image")
          .map((f) => f.filename);
        
        imagesArray = [...imagesArray, ...newImages];

        updates = [
          "title = ?",
          "content = ?",
          "image = ?",
          "author = ?",
          "tags = ?",
          "published_date = ?",
          "is_published = ?",
          "region = ?",
          "last_modified_by = ?",
          "last_modified_at = CURRENT_TIMESTAMP"
        ];
        values = [
          body.title,
          body.content,
          JSON.stringify(imagesArray),
          body.author,
          JSON.stringify(JSON.parse(body.tags || "[]")),
          body.published_date,
          body.is_published,
          body.region ?? existing.region,
          req.user.id,
          id
        ];
        break;

      case "documentaries":
        updates = [
          "title = ?",
          "description = ?",
          "video_url = ?",
          "video_filename = ?",
          "thumbnail = ?",
          "duration = ?",
          "published_date = ?",
          "is_published = ?",
          "region = ?",
          "last_modified_by = ?",
          "last_modified_at = CURRENT_TIMESTAMP"
        ];
        values = [
          body.title,
          body.description,
          body.video_url,
          videoFile ? videoFile.filename : existing.video_filename,
          imageFile ? imageFile.filename : existing.thumbnail,
          body.duration,
          body.published_date,
          body.is_published,
          body.region ?? existing.region,
          req.user.id,
          id
        ];
        break;
    }

    const query = `UPDATE ${type} SET ${updates.join(", ")} WHERE id = ?`;
    await db.query(query, values);

    res.json({ message: `${type.slice(0, -1)} updated successfully` });

  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    res.status(500).json({ error: "Failed to update item" });
  }
});


// --------------------------------------------------
//   DELETE ITEM
// --------------------------------------------------
router.delete("/:type/:id", authenticateToken, async (req, res) => {
  const { type, id } = req.params;
  if (!isValidMediaType(type)) return res.status(400).json({ error: "Invalid media type" });

  try {
    const fileColumns = mediaTables[type].fileFields.concat(["id"]);
    const columnList = fileColumns.join(", ");

    const [rows] = await db.query(
      `SELECT ${columnList} FROM ${type} WHERE id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Item not found" });

    const item = rows[0];

    // Delete files
    for (const f of mediaTables[type].fileFields) {
      if (item[f]) {
        if (type === 'blogs' && f === 'image') {
          try {
            const images = JSON.parse(item[f]);
            if (Array.isArray(images)) {
              for (const img of images) {
                const filePath = `uploads/media/${type}/${img}`;
                await fs.unlink(filePath).catch(() => { });
              }
            } else {
              const filePath = `uploads/media/${type}/${item[f]}`;
              await fs.unlink(filePath).catch(() => { });
            }
          } catch (e) {
            const filePath = `uploads/media/${type}/${item[f]}`;
            await fs.unlink(filePath).catch(() => { });
          }
        } else {
          const filePath = `uploads/media/${type}/${item[f]}`;
          await fs.unlink(filePath).catch(() => { });
        }
      }
    }

    await db.query(`DELETE FROM ${type} WHERE id = ?`, [id]);

    res.json({ message: `${type.slice(0, -1)} deleted successfully` });

  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});


// --------------------------------------------------
//   PUBLISH / UNPUBLISH
// --------------------------------------------------
router.patch("/:type/:id/publish", authenticateToken, async (req, res) => {
  const { type, id } = req.params;
  const { is_published } = req.body;

  if (!isValidMediaType(type))
    return res.status(400).json({ error: "Invalid media type" });

  try {
    const query = `
      UPDATE ${type}
      SET is_published = ?, last_modified_by = ?, last_modified_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await db.query(query, [is_published, req.user.id, id]);

    res.json({
      message: `${type.slice(0, -1)} ${is_published ? "published" : "unpublished"} successfully`,
      is_published
    });

  } catch (error) {
    console.error(`Error publishing ${type}:`, error);
    res.status(500).json({ error: "Failed to update status" });
  }
});


// --------------------------------------------------
//   GET SCHEDULED
// --------------------------------------------------
router.get("/scheduled/:type", async (req, res) => {
  const { type } = req.params;

  if (!isValidMediaType(type))
    return res.status(400).json({ error: "Invalid media type" });

  try {
    const columns = getSelectColumns(type, "m");

    const query = `
      SELECT ${columns}, u.username AS last_modified_by_name
      FROM ${type} m
      LEFT JOIN users u ON m.last_modified_by = u.id
      WHERE m.is_published = FALSE AND m.published_date > NOW()
      ORDER BY m.published_date ASC
    `;

    const [results] = await db.query(query);
    res.json(results);

  } catch (error) {
    console.error(`Error fetching scheduled ${type}:`, error);
    res.status(500).json({ error: "Failed to fetch scheduled items" });
  }
});


// --------------------------------------------------
//   PUBLISH ALL SCHEDULED ITEMS
// --------------------------------------------------
router.post("/publish-scheduled", authenticateToken, async (req, res) => {
  try {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    let count = 0;

    for (const type of Object.keys(mediaTables)) {
      const query = `
        UPDATE ${type}
        SET is_published = TRUE, last_modified_by = ?, last_modified_at = CURRENT_TIMESTAMP
        WHERE is_published = FALSE AND published_date <= ?
      `;
      const [result] = await db.query(query, [req.user.id, now]);
      count += result.affectedRows;
    }

    res.json({ message: "Scheduled items published", count });

  } catch (error) {
    console.error("Error publishing scheduled:", error);
    res.status(500).json({ error: "Failed to publish scheduled items" });
  }
});


// --------------------------------------------------
//   STATISTICS
// --------------------------------------------------
router.get("/stats/:type", async (req, res) => {
  const { type } = req.params;
  if (!isValidMediaType(type)) return res.status(400).json({ error: "Invalid media type" });

  try {
    const [total] = await db.query(`SELECT COUNT(*) AS total FROM ${type}`);
    const [published] = await db.query(`SELECT COUNT(*) AS total FROM ${type} WHERE is_published = TRUE`);
    const [scheduled] = await db.query(`SELECT COUNT(*) AS total FROM ${type} WHERE is_published = FALSE AND published_date > NOW()`);

    res.json({
      total: total[0].total,
      published: published[0].total,
      scheduled: scheduled[0].total,
      draft: total[0].total - published[0].total - scheduled[0].total
    });

  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// ---------- EXPORT ----------
module.exports = router;
