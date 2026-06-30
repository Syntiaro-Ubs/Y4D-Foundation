const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/database");
const fs = require("fs").promises;
const { authenticateToken: auth } = require("../middleware/auth");
const consoleLogger = require("../utils/logger");
const { publicLimiter, adminLimiter, uploadLimiter } = require("../middleware/rateLimiter");
const { sendError, sendSuccess, sendNotFound, sendInternalError } = require("../utils/response");
const { validateCategory, validateId, validateOurWorkItem, validateStatusUpdate, validateDisplayOrder } = require("../middleware/validation");
const router = express.Router();

/**
 * Table definitions: each category uses the same business fields (as you confirmed)
 * We'll use these to build explicit SELECT lists and to know which file fields to check/delete.
 */
const ourWorkTables = {
  quality_education: {
    fields: [
      "title",
      "description",
      "content",
      "image_url",
      "video_url",
      "additional_images",
      "meta_title",
      "meta_description",
      "meta_keywords",
      "is_active",
      "display_order"
    ],
    fileFields: ["image_url", "additional_images"] // additional_images will be JSON array of filenames or URLs
  },
  livelihood: {
    fields: [
      "title",
      "description",
      "content",
      "image_url",
      "video_url",
      "additional_images",
      "meta_title",
      "meta_description",
      "meta_keywords",
      "is_active",
      "display_order"
    ],
    fileFields: ["image_url", "additional_images"]
  },
  healthcare: {
    fields: [
      "title",
      "description",
      "content",
      "image_url",
      "video_url",
      "additional_images",
      "meta_title",
      "meta_description",
      "meta_keywords",
      "is_active",
      "display_order"
    ],
    fileFields: ["image_url", "additional_images"]
  },
  environment_sustainability: {
    fields: [
      "title",
      "description",
      "content",
      "image_url",
      "video_url",
      "additional_images",
      "meta_title",
      "meta_description",
      "meta_keywords",
      "is_active",
      "display_order"
    ],
    fileFields: ["image_url", "additional_images"]
  },
  integrated_development: {
    fields: [
      "title",
      "description",
      "content",
      "image_url",
      "video_url",
      "additional_images",
      "meta_title",
      "meta_description",
      "meta_keywords",
      "is_active",
      "display_order"
    ],
    fileFields: ["image_url", "additional_images"]
  }
};

const isValidCategory = (category) => ourWorkTables.hasOwnProperty(category);

// Helper: build explicit SELECT column list for a category
function getSelectColumns(category, alias = "ow") {
  if (!isValidCategory(category)) {
    // fallback minimal list
    return `${alias}.id`;
  }
  // include business fields + system fields (all guaranteed present)
  const businessCols = ourWorkTables[category].fields.map((f) => `${alias}.${f}`);
  const systemCols = [
    `${alias}.region`,
    `${alias}.created_at`,
    `${alias}.updated_at`,
    `${alias}.last_modified_by`,
    `${alias}.last_modified_at`
  ];
  return [`${alias}.id`, ...businessCols, ...systemCols].join(", ");
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.params.category;
    const uploadPath = `uploads/our-work/${category}/`;
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
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
}).any();

/* ------------------------------------------------------------------
   PUBLIC: Get all published items for a specific category
   ------------------------------------------------------------------ */
router.get("/published/:category", publicLimiter, validateCategory, async (req, res) => {
  const { category } = req.params;
  const { region } = req.query;
  try {
    // Build explicit column list
    const columns = getSelectColumns(category, "ow");

    let query = `
      SELECT ${columns}, u.username as last_modified_by_name
      FROM ${category} ow
      LEFT JOIN users u ON ow.last_modified_by = u.id
      WHERE ow.is_active = TRUE
    `;
    const params = [];

    if (region && region !== "all") {
      query += ` AND (ow.region = ? OR ow.region = 'both')`;
      params.push(region);
    }

    query += ` ORDER BY ow.display_order ASC, ow.created_at DESC`;

    const [results] = await db.query(query, params);
    return res.status(200).json(results || []);
  } catch (error) {
    consoleLogger.error(`Error fetching published ${category}:`, error);
    return sendInternalError(res, error, `Failed to fetch ${category}`);
  }
});

/* ------------------------------------------------------------------
   PUBLIC: Get single published item by ID
   ------------------------------------------------------------------ */
router.get("/published/:category/:id", publicLimiter, validateCategory, validateId, async (req, res) => {
  const { category, id } = req.params;
  try {
    const columns = getSelectColumns(category, "ow");
    const query = `
      SELECT ${columns}, u.username as last_modified_by_name
      FROM ${category} ow
      LEFT JOIN users u ON ow.last_modified_by = u.id
      WHERE ow.id = ? AND ow.is_active = TRUE
    `;
    const [results] = await db.query(query, [id]);
    if (results.length === 0) return sendNotFound(res, "Item not found or not published");
    return res.status(200).json(results[0]);
  } catch (error) {
    consoleLogger.error(`Error fetching published ${category} item:`, error);
    return sendInternalError(res, error, `Failed to fetch ${category} item`);
  }
});

/* ------------------------------------------------------------------
   ADMIN: Get all items for a category (filtered by role)
   ------------------------------------------------------------------ */
router.get("/admin/:category", auth, adminLimiter, validateCategory, async (req, res) => {
  const { category } = req.params;
  const { region } = req.query;
  try {
    const columns = getSelectColumns(category, "ow");
    let query;
    let params = [];

    if (["admin", "super_admin"].includes(req.user.role)) {
      query = `
        SELECT ${columns}, u.username as last_modified_by_name
        FROM ${category} ow
        LEFT JOIN users u ON ow.last_modified_by = u.id
        WHERE 1=1
      `;
    } else {
      // regular user: show their items OR published items
      query = `
        SELECT ${columns}
        FROM ${category} ow
        WHERE (ow.last_modified_by = ? OR ow.is_active = TRUE)
      `;
      params = [req.user.id];
    }

    if (region && region !== "all") {
      query += ` AND (ow.region = ? OR ow.region = 'both')`;
      params.push(region);
    }

    query += ` ORDER BY ow.display_order ASC, ow.created_at DESC`;

    const [results] = await db.query(query, params);
    return res.status(200).json(results || []);
  } catch (error) {
    consoleLogger.error(`Error fetching ${category}:`, error);
    return sendInternalError(res, error, `Failed to fetch ${category}`);
  }
});

/* ------------------------------------------------------------------
   ADMIN: Get single item by id (with user info)
   ------------------------------------------------------------------ */
router.get("/admin/:category/:id", auth, validateCategory, validateId, async (req, res) => {
  const { category, id } = req.params;
  try {
    const columns = getSelectColumns(category, "ow");
    const query = `
      SELECT ${columns}, u.username as last_modified_by_name
      FROM ${category} ow
      LEFT JOIN users u ON ow.last_modified_by = u.id
      WHERE ow.id = ?
    `;
    const [results] = await db.query(query, [id]);
    if (results.length === 0) return sendNotFound(res, "Item not found");
    return res.status(200).json(results[0]);
  } catch (error) {
    consoleLogger.error(`Error fetching ${category} item:`, error);
    return sendInternalError(res, error, `Failed to fetch ${category} item`);
  }
});

/* ------------------------------------------------------------------
   ADMIN: Create item
   ------------------------------------------------------------------ */
router.post("/admin/:category", auth, uploadLimiter, validateCategory, validateOurWorkItem, (req, res, next) => {
  upload(req, res, function (err) {
    if (err) return sendInternalError(res, err, "File upload error");
    createItem(req, res).catch(next);
  });
});

async function createItem(req, res) {
  const { category } = req.params;
  try {
    consoleLogger.debug(`Creating ${category} item`, {
      fileCount: req.files?.length || 0
    });

    const files = req.files || [];
    const imageFile = files.find((f) => f.fieldname === "image");
    // build values from body + files
    const {
      title,
      description,
      content,
      image_url,
      video_url,
      additional_images,
      meta_title,
      meta_description,
      meta_keywords,
      is_active,
      display_order,
      region
    } = req.body;

    const isActiveBool = is_active === "true" || is_active === "1" || is_active === true;
    const displayOrderInt = parseInt(display_order) || 0;
    const itemRegion = region || 'both';

    // Prefer uploaded image over provided image_url
    const finalImageUrl = imageFile ? `/uploads/our-work/${category}/${imageFile.filename}` : (image_url || "");

    // parse additional_images (expected JSON array or array)
    let additionalImagesArray = [];
    if (additional_images) {
      try {
        additionalImagesArray = typeof additional_images === "string" ? JSON.parse(additional_images) : additional_images;
        if (!Array.isArray(additionalImagesArray)) additionalImagesArray = [additionalImagesArray];
      } catch (err) {
        consoleLogger.warn("Error parsing additional_images:", err.message);
        additionalImagesArray = [];
      }
    }

    // Build fields/values: explicit list (match ourWorkTables fields order)
    const fields = [
      "title",
      "description",
      "content",
      "image_url",
      "video_url",
      "additional_images",
      "meta_title",
      "meta_description",
      "meta_keywords",
      "is_active",
      "display_order",
      "region",
      "last_modified_by"
    ];

    const values = [
      title || "",
      description || "",
      content || "",
      finalImageUrl || "",
      video_url || "",
      JSON.stringify(additionalImagesArray),
      meta_title || "",
      meta_description || "",
      meta_keywords || "",
      isActiveBool ? 1 : 0,
      displayOrderInt,
      itemRegion,
      req.user.id
    ];

    const placeholders = fields.map(() => "?").join(", ");
    const query = `INSERT INTO ${category} (${fields.join(", ")}) VALUES (${placeholders})`;

    const [result] = await db.query(query, values);

    return sendSuccess(res, { id: result.insertId, is_active: isActiveBool }, "Item created successfully");
  } catch (error) {
    consoleLogger.error(`Error creating ${category} item:`, {
      message: error.message,
      sqlMessage: error.sqlMessage,
      userId: req.user?.id
    });

    // cleanup uploaded files
    if (req.files) {
      for (const f of req.files) {
        try {
          await fs.unlink(f.path);
          consoleLogger.debug("Cleaned up file after error:", f.path);
        } catch (unlinkErr) {
          consoleLogger.error("Error cleaning up file:", unlinkErr.message);
        }
      }
    }

    return sendInternalError(res, error, `Failed to create ${category} item`);
  }
}

/* ------------------------------------------------------------------
   ADMIN: Update item
   ------------------------------------------------------------------ */
router.put("/admin/:category/:id", auth, uploadLimiter, validateCategory, validateId, validateOurWorkItem, (req, res, next) => {
  upload(req, res, function (err) {
    if (err) return sendInternalError(res, err, "File upload error");
    updateItem(req, res).catch(next);
  });
});

async function updateItem(req, res) {
  const { category, id } = req.params;
  try {
    // Use explicit columns for the SELECT that checks existing item
    const columns = getSelectColumns(category, "ow");
    const [existingRows] = await db.query(`SELECT ${columns} FROM ${category} ow WHERE ow.id = ?`, [id]);

    if (existingRows.length === 0) return sendNotFound(res, "Item not found");

    const existingItem = existingRows[0];
    const files = req.files || [];
    const imageFile = files.find((f) => f.fieldname === "image");

    const {
      title,
      description,
      content,
      image_url,
      video_url,
      additional_images,
      meta_title,
      meta_description,
      meta_keywords,
      is_active,
      display_order,
      region
    } = req.body;

    // determine final image_url (uploaded or provided)
    let finalImageUrl = image_url || existingItem.image_url || "";
    if (imageFile) {
      finalImageUrl = `/uploads/our-work/${category}/${imageFile.filename}`;

      // delete old file if it was stored under uploads and is not external
      if (existingItem.image_url && existingItem.image_url.startsWith("/uploads")) {
        try {
          const oldPath = path.join(process.cwd(), existingItem.image_url);
          await fs.unlink(oldPath);
        } catch (unlinkError) {
          consoleLogger.warn("Error deleting old image:", unlinkError.message);
        }
      }
    }

    // handle additional images
    let additionalImagesArray = existingItem.additional_images;
    if (additional_images) {
      try {
        additionalImagesArray = typeof additional_images === "string" ? JSON.parse(additional_images) : additional_images;
        if (!Array.isArray(additionalImagesArray)) additionalImagesArray = [additionalImagesArray];
      } catch (err) {
        consoleLogger.warn("Error parsing additional_images, keeping existing:", err.message);
        additionalImagesArray = existingItem.additional_images || [];
      }
    } else {
      // if existingItem.additional_images is a JSON string, keep it as parsed
      if (typeof existingItem.additional_images === "string" && existingItem.additional_images) {
        try {
          additionalImagesArray = JSON.parse(existingItem.additional_images);
        } catch (err) {
          additionalImagesArray = existingItem.additional_images;
        }
      }
    }

    // Build updates explicitly (matching your fields)
    const updates = [
      "title = ?",
      "description = ?",
      "content = ?",
      "image_url = ?",
      "video_url = ?",
      "additional_images = ?",
      "meta_title = ?",
      "meta_description = ?",
      "meta_keywords = ?",
      "is_active = ?",
      "display_order = ?",
      "region = ?",
      "last_modified_by = ?",
      "last_modified_at = CURRENT_TIMESTAMP"
    ];

    const values = [
      title ?? existingItem.title,
      description ?? existingItem.description,
      content ?? existingItem.content,
      finalImageUrl,
      video_url ?? existingItem.video_url,
      JSON.stringify(additionalImagesArray),
      meta_title ?? existingItem.meta_title,
      meta_description ?? existingItem.meta_description,
      meta_keywords ?? existingItem.meta_keywords,
      (is_active === "true" || is_active === "1" || is_active === true) ? 1 : (existingItem.is_active ? 1 : 0),
      parseInt(display_order) || existingItem.display_order || 0,
      region ?? existingItem.region,
      req.user.id,
      id
    ];

    const query = `UPDATE ${category} SET ${updates.join(", ")} WHERE id = ?`;
    await db.query(query, values);

    return sendSuccess(res, { is_active: values[9] }, "Item updated successfully");
  } catch (error) {
    consoleLogger.error(`Error updating ${category} item:`, {
      message: error.message,
      sqlMessage: error.sqlMessage,
      userId: req.user?.id,
      itemId: req.params.id
    });

    // cleanup uploaded files on error
    if (req.files) {
      for (const f of req.files) {
        try {
          await fs.unlink(f.path);
        } catch (unlinkError) {
          consoleLogger.error("Error cleaning up file:", unlinkError.message);
        }
      }
    }

    return sendInternalError(res, error, `Failed to update ${category} item`);
  }
}

/* ------------------------------------------------------------------
   ADMIN: Delete item
   ------------------------------------------------------------------ */
router.delete("/admin/:category/:id", auth, adminLimiter, validateCategory, validateId, async (req, res) => {
  const { category, id } = req.params;
  try {
    // Use explicit columns — include file-related fields so we can safely remove files
    const fileCols = Array.from(new Set([...ourWorkTables[category].fileFields, "id"]));
    const columnList = fileCols.join(", ");

    // If any file field is not present in table, this query may throw; the table definitions
    // above assume these columns do exist. Validation kept earlier ensures category is valid.
    const [rows] = await db.query(`SELECT ${columnList} FROM ${category} WHERE id = ?`, [id]);
    if (rows.length === 0) return sendNotFound(res, "Item not found");

    const item = rows[0];

    // delete image_url (if stored in uploads) and additional_images
    if (item.image_url && typeof item.image_url === "string" && item.image_url.startsWith("/uploads")) {
      try {
        const filePath = path.join(process.cwd(), item.image_url);
        await fs.unlink(filePath).catch(() => { });
      } catch (unlinkError) {
        consoleLogger.warn("Error deleting associated image:", unlinkError.message);
      }
    }

    if (item.additional_images) {
      try {
        const additionalImages = typeof item.additional_images === "string" ? JSON.parse(item.additional_images) : item.additional_images;
        if (Array.isArray(additionalImages)) {
          for (const imageUrl of additionalImages) {
            if (imageUrl && typeof imageUrl === "string") {
              try {
                // try both absolute path and uploads folder path
                if (imageUrl.startsWith("/uploads")) {
                  await fs.unlink(path.join(process.cwd(), imageUrl)).catch(() => { });
                } else {
                  await fs.unlink(`uploads/our-work/${category}/${imageUrl}`).catch(() => { });
                }
              } catch (unlinkError) {
                consoleLogger.warn("Error deleting additional image:", unlinkError.message);
              }
            }
          }
        }
      } catch (err) {
        consoleLogger.warn("Error parsing additional_images for deletion:", err.message);
      }
    }

    const [result] = await db.query(`DELETE FROM ${category} WHERE id = ?`, [id]);
    if (result.affectedRows === 0) return sendNotFound(res, "Item not found");

    return sendSuccess(res, null, "Item deleted successfully");
  } catch (error) {
    consoleLogger.error(`Error deleting ${category} item:`, {
      message: error.message,
      sqlMessage: error.sqlMessage,
      userId: req.user?.id,
      itemId: id
    });
    return sendInternalError(res, error, `Failed to delete ${category} item`);
  }
});

/* ------------------------------------------------------------------
   ADMIN: Toggle active status
   ------------------------------------------------------------------ */
router.patch("/admin/:category/:id/status", auth, adminLimiter, validateCategory, validateId, validateStatusUpdate, async (req, res) => {
  const { category, id } = req.params;
  const { is_active } = req.body;

  try {
    const query = `UPDATE ${category} SET is_active = ?, last_modified_by = ?, last_modified_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await db.query(query, [is_active, req.user.id, id]);
    return sendSuccess(res, { is_active }, `Item ${is_active ? "activated" : "deactivated"} successfully`);
  } catch (error) {
    consoleLogger.error(`Error toggling active status for ${category}:`, {
      message: error.message,
      userId: req.user?.id,
      itemId: id
    });
    return sendInternalError(res, error, `Failed to update status`);
  }
});

/* ------------------------------------------------------------------
   ADMIN: Update display order
   ------------------------------------------------------------------ */
router.patch("/admin/:category/:id/order", auth, adminLimiter, validateCategory, validateId, validateDisplayOrder, async (req, res) => {
  const { category, id } = req.params;
  const { display_order } = req.body;

  try {
    const query = `UPDATE ${category} SET display_order = ?, last_modified_by = ?, last_modified_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await db.query(query, [display_order, req.user.id, id]);
    return sendSuccess(res, { display_order }, "Display order updated successfully");
  } catch (error) {
    consoleLogger.error(`Error updating display order for ${category}:`, {
      message: error.message,
      userId: req.user?.id,
      itemId: id
    });
    return sendInternalError(res, error, "Failed to update display order");
  }
});

/* ------------------------------------------------------------------
   ADMIN: Stats for a category (total, active, inactive, recent activity)
   ------------------------------------------------------------------ */
router.get("/admin/stats/:category", auth, adminLimiter, validateCategory, async (req, res) => {
  const { category } = req.params;
  try {
    const totalQuery = `SELECT COUNT(*) as total FROM ${category}`;
    const activeQuery = `SELECT COUNT(*) as active FROM ${category} WHERE is_active = TRUE`;
    const recentActivityQuery = `
      SELECT u.username, COUNT(*) as modification_count
      FROM ${category} ow
      JOIN users u ON ow.last_modified_by = u.id
      WHERE ow.last_modified_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY u.username
      ORDER BY modification_count DESC
    `;

    const [totalResult] = await db.query(totalQuery);
    const [activeResult] = await db.query(activeQuery);
    const [recentActivityResult] = await db.query(recentActivityQuery);

    return res.json({
      total: totalResult[0].total,
      active: activeResult[0].active,
      inactive: totalResult[0].total - activeResult[0].active,
      recent_activity: recentActivityResult
    });
  } catch (error) {
    consoleLogger.error(`Error fetching stats for ${category}:`, error.message);
    return sendInternalError(res, error, "Failed to fetch statistics");
  }
});

/* ------------------------------------------------------------------
   ADMIN: Aggregate stats across categories
   ------------------------------------------------------------------ */
router.get("/admin/categories/stats", auth, adminLimiter, async (req, res) => {
  try {
    const stats = {};
    for (const category of Object.keys(ourWorkTables)) {
      try {
        const totalQuery = `SELECT COUNT(*) as total FROM ${category}`;
        const activeQuery = `SELECT COUNT(*) as active FROM ${category} WHERE is_active = TRUE`;
        const recentModificationsQuery = `
          SELECT COUNT(*) as recent_modifications
          FROM ${category}
          WHERE last_modified_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `;

        const [totalResult] = await db.query(totalQuery);
        const [activeResult] = await db.query(activeQuery);
        const [recentModificationsResult] = await db.query(recentModificationsQuery);

        stats[category] = {
          total: totalResult[0].total,
          active: activeResult[0].active,
          inactive: totalResult[0].total - activeResult[0].active,
          recent_modifications: recentModificationsResult[0].recent_modifications
        };
      } catch (error) {
        consoleLogger.error(`Error fetching stats for ${category}:`, error.message);
        stats[category] = { error: "Failed to fetch statistics" };
      }
    }
    return res.json(stats);
  } catch (error) {
    consoleLogger.error("Error fetching category statistics:", error.message);
    return sendInternalError(res, error, "Failed to fetch category statistics");
  }
});

module.exports = router;
