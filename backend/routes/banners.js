// routes/banners.js
const express = require("express");
const router = express.Router();
const db = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { sendError, sendSuccess, sendNotFound, sendInternalError } = require("../utils/response");
const consoleLogger = require("../utils/logger");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/banners/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "banner-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  },
});

// Helper function to get user name by ID
const getUserNameById = async (userId) => {
  try {
    if (!userId) return "System";

    const [users] = await db.query(
      "SELECT username, name FROM users WHERE id = ?",
      [userId]
    );
    if (users.length > 0) {
      return users[0].username || users[0].name || "Unknown User";
    }
    return "Unknown User";
  } catch (error) {
    console.error("Error fetching user name:", error);
    return "Unknown User";
  }
};

// GET all banners with filtering (for dashboard - shows all banners)
router.get("/", async (req, res) => {
  try {
    const { page, section, category, active_only, region } = req.query;

    let query = `
      SELECT 
        b.*,
        u.username as last_modified_by_name
      FROM banners b
      LEFT JOIN users u ON b.last_modified_by = u.id
      WHERE 1=1
    `;
    const params = [];

    // Only filter by is_active if active_only is explicitly true
    if (active_only === "true") {
      query += " AND b.is_active = true";
    }

    if (page && page !== "all") {
      query += " AND b.page = ?";
      params.push(page);
    }

    if (section && section !== "all") {
      query += " AND b.section = ?";
      params.push(section);
    }

    if (category && category !== "all") {
      query += " AND b.category = ?";
      params.push(category);
    }

    if (region && region !== "all") {
      query += " AND (b.region = ? OR b.region = 'both')";
      params.push(region);
    }

    query += " ORDER BY b.created_at DESC";

    console.log("📋 Fetching banners with filters:", {
      page,
      section,
      category,
      active_only,
    });
    const [results] = await db.query(query, params);

    console.log(`✅ Successfully fetched ${results.length} banners`);
    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    res.status(500).json({
      error: "Failed to fetch banners",
      details: error.message,
    });
  }
});

// GET banners by page (for frontend - only active banners)
router.get("/page/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const { section, region } = req.query;

    let query = `
      SELECT 
        b.*,
        u.username as last_modified_by_name
      FROM banners b
      LEFT JOIN users u ON b.last_modified_by = u.id
      WHERE b.is_active = true AND b.page = ?
    `;
    const params = [page];

    if (section) {
      query += " AND b.section = ?";
      params.push(section);
    }

    if (region && region !== "all") {
      query += " AND (b.region = ? OR b.region = 'both')";
      params.push(region);
    }

    query += " ORDER BY b.created_at DESC";

    console.log(
      `📋 Fetching active banners for page: ${page}, section: ${section}, region: ${region}`
    );
    const [results] = await db.query(query, params);

    console.log(
      `✅ Successfully fetched ${results.length} active banners for ${page}`
    );
    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching page banners:", error);
    res.status(500).json({
      error: "Failed to fetch page banners",
      details: error.message,
    });
  }
});

// GET all unique pages (for dashboard)
router.get("/pages/list", async (req, res) => {
  try {
    const query = "SELECT DISTINCT page FROM banners ORDER BY page";
    const [results] = await db.query(query);

    const pages = results.map((row) => row.page);
    res.json(pages);
  } catch (error) {
    console.error("❌ Error fetching pages list:", error);
    res.status(500).json({
      error: "Failed to fetch pages list",
      details: error.message,
    });
  }
});

// GET active banners for frontend
router.get("/active", async (req, res) => {
  try {
    const { region } = req.query;
    console.log("📋 Fetching active banners for frontend, region: " + region);

    let query = `
      SELECT 
        b.*,
        u.username as last_modified_by_name
      FROM banners b
      LEFT JOIN users u ON b.last_modified_by = u.id
      WHERE b.is_active = true 
    `;
    const params = [];

    if (region && region !== "all") {
      query += " AND (b.region = ? OR b.region = 'both')";
      params.push(region);
    }

    query += " ORDER BY b.created_at DESC";
    const [results] = await db.query(query, params);

    console.log(`✅ Successfully fetched ${results.length} active banners`);
    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching active banners:", error);
    res.status(500).json({
      error: "Failed to fetch active banners",
      details: error.message,
    });
  }
});

// GET single banner by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📋 Fetching banner with ID: ${id}`);

    const query = `
      SELECT 
        b.*,
        u.username as last_modified_by_name
      FROM banners b
      LEFT JOIN users u ON b.last_modified_by = u.id
      WHERE b.id = ?
    `;
    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      console.log(`❌ Banner not found with ID: ${id}`);
      return res.status(404).json({ error: "Banner not found" });
    }

    console.log(`✅ Successfully fetched banner ID: ${id}`);
    res.json(results[0]);
  } catch (error) {
    console.error("❌ Error fetching banner:", error);
    res.status(500).json({
      error: "Failed to fetch banner",
      details: error.message,
    });
  }
});

// POST new banner
router.post("/", upload.array("media"), async (req, res) => {
  try {
    console.log("➕ Creating new banner(s)");

    const { media_type, page, section, category, is_active, modified_by_id } =
      req.body;

    const bannerRegion = req.body.region || req.query.region || 'both';

    // Check for files (multiple) or single file (if coming from single upload form, though we're changing to array)
    const files = req.files;

    console.log("📤 Banner data:", {
      media_type,
      page,
      section,
      category,
      is_active,
      modified_by_id,
      region: bannerRegion,
      files_count: files ? files.length : 0,
    });

    // Validate required fields
    if (!media_type || !page || !section) {
      return res.status(400).json({
        error: "Missing required fields: media_type, page, section",
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        error: "Media files are required",
      });
    }

    // Convert string values to proper types
    const isActive =
      is_active === "true" || is_active === true || is_active === "1";
    const modifiedById = modified_by_id ? parseInt(modified_by_id) : null;

    const createdBanners = [];
    const errors = [];

    // Process each file
    for (const file of files) {
      try {
        const query = `
          INSERT INTO banners (
            media_type, media, page, section, category, is_active, region,
            last_modified_by, last_modified_at
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;

        const [result] = await db.query(query, [
          media_type,
          file.filename, // Use the filename from multer
          page,
          section,
          category || "main",
          isActive,
          bannerRegion,
          modifiedById,
        ]);

        createdBanners.push({
          id: result.insertId,
          media: file.filename
        });

        console.log(`✅ Banner created successfully: ${file.filename} (ID: ${result.insertId})`);
      } catch (err) {
        console.error(`❌ Error inserting banner for file ${file.originalname}:`, err);
        errors.push({ file: file.originalname, error: err.message });
      }
    }

    if (createdBanners.length === 0 && errors.length > 0) {
      return res.status(500).json({
        error: "Failed to create any banners",
        details: errors
      });
    }

    res.status(201).json({
      message: `${createdBanners.length} banners created successfully`,
      created_banners: createdBanners,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error("❌ Error creating banner:", error);
    res.status(500).json({
      error: "Failed to create banner",
      details: error.message,
    });
  }
});

// PUT update banner
router.put("/:id", upload.single("media"), async (req, res) => {
  try {
    const { id } = req.params;
    const { media_type, page, section, category, is_active, modified_by_id } =
      req.body;

    const bannerRegion = req.body.region || req.query.region || 'both';

    console.log(`✏️ Updating banner with ID: ${id}`);
    console.log("📤 Update data:", {
      media_type,
      page,
      section,
      category,
      is_active,
      modified_by_id,
      region: bannerRegion,
    });

    // Validate required fields
    if (!media_type || !page || !section) {
      return res.status(400).json({
        error: "Missing required fields: media_type, page, section",
      });
    }

    // Convert string values to proper types
    const isActive =
      is_active === "true" || is_active === true || is_active === "1";
    const modifiedById = modified_by_id ? parseInt(modified_by_id) : null;

    // First get current banner to handle media updates
    // IMPORTANT: Select 'media' field to preserve it when no new file is uploaded
    const getQuery = "SELECT id, media FROM banners WHERE id = ?";
    const [currentResults] = await db.query(getQuery, [id]);

    if (currentResults.length === 0) {
      console.log(`❌ Banner not found with ID: ${id}`);
      return res.status(404).json({ error: "Banner not found" });
    }

    const currentBanner = currentResults[0];
    // Preserve existing media if no new file is uploaded
    let media = currentBanner.media;

    // Only update media if a new file is actually uploaded
    if (req.file) {
      media = req.file.filename;

      // Delete old media file only if it exists and is different from new file
      if (currentBanner.media && currentBanner.media !== media) {
        // Try multiple possible paths (server compatibility)
        const possiblePaths = [
          path.join(process.cwd(), "uploads", "banners", currentBanner.media),
          path.join(__dirname, "..", "uploads", "banners", currentBanner.media),
          path.join(process.cwd(), "backend", "uploads", "banners", currentBanner.media),
          path.join(process.cwd(), "..", "uploads", "banners", currentBanner.media),
          path.join("uploads", "banners", currentBanner.media), // Relative path fallback
        ];

        let fileDeleted = false;
        for (const oldMediaPath of possiblePaths) {
          try {
            if (fs.existsSync(oldMediaPath)) {
              fs.unlinkSync(oldMediaPath);
              consoleLogger.log(`🗑️ Deleted old media: ${currentBanner.media} from ${oldMediaPath}`);
              fileDeleted = true;
              break;
            }
          } catch (err) {
            consoleLogger.warn(
              `⚠️ Failed to delete old media: ${oldMediaPath}`,
              { error: err.message }
            );
            // Continue to next path
          }
        }

        if (!fileDeleted) {
          consoleLogger.warn(
            `⚠️ Old media file not found in any expected location: ${currentBanner.media}`
          );
        }
      }
      consoleLogger.log(`🖼️ New media uploaded: ${media}`);
    } else {
      // No new file uploaded - preserve existing media
      consoleLogger.log(`📌 Preserving existing media: ${currentBanner.media || 'none'}`);
    }

    const updateQuery = `
      UPDATE banners 
      SET 
        media_type = ?, 
        media = ?, 
        page = ?, 
        section = ?, 
        category = ?, 
        is_active = ?, 
        region = ?,
        last_modified_by = ?, 
        last_modified_at = CURRENT_TIMESTAMP, 
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;

    await db.query(updateQuery, [
      media_type,
      media,
      page,
      section,
      category || "main",
      isActive,
      bannerRegion,
      modifiedById,
      id,
    ]);

    consoleLogger.log(`✅ Banner updated successfully ID: ${id}`);

    // Return updated banner with user info
    const [updatedBanner] = await db.query(
      `
      SELECT 
        b.*,
        u.username as last_modified_by_name
      FROM banners b
      LEFT JOIN users u ON b.last_modified_by = u.id
      WHERE b.id = ?
    `,
      [id]
    );

    if (updatedBanner.length === 0) {
      return sendNotFound(res, "Banner not found after update");
    }

    return sendSuccess(res, { banner: updatedBanner[0] }, "Banner updated successfully");
  } catch (error) {
    consoleLogger.error("❌ Error updating banner:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      bannerId: id,
    });

    // Provide more specific error messages
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      return sendInternalError(res, error, "Database connection failed. Please contact administrator.");
    }

    if (error.code === 'ER_NO_SUCH_TABLE') {
      return sendInternalError(res, error, "Database configuration error. Please contact administrator.");
    }

    return sendInternalError(res, error, "Failed to update banner. Please try again or contact support.");
  }
});

// DELETE banner
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting banner with ID: ${id}`);

    // First get banner to delete media file
    const getQuery = "SELECT id, media FROM banners WHERE id = ?";
    const [results] = await db.query(getQuery, [id]);

    if (results.length === 0) {
      console.log(`❌ Banner not found with ID: ${id}`);
      return res.status(404).json({ error: "Banner not found" });
    }

    const banner = results[0];

    // Delete media file if exists (non-blocking - won't fail deletion if file delete fails)
    if (banner.media) {
      // Use process.cwd() instead of __dirname for better server compatibility
      // Try multiple possible paths (server might have different directory structure)
      const possiblePaths = [
        path.join(process.cwd(), "uploads", "banners", banner.media),
        path.join(__dirname, "..", "uploads", "banners", banner.media),
        path.join(process.cwd(), "backend", "uploads", "banners", banner.media),
        path.join(process.cwd(), "..", "uploads", "banners", banner.media),
      ];

      consoleLogger.log("🔍 Searching for media file:", {
        filename: banner.media,
        cwd: process.cwd(),
        __dirname: __dirname,
        possiblePaths: possiblePaths,
      });

      let fileDeleted = false;
      let foundPath = null;

      for (const mediaPath of possiblePaths) {
        try {
          if (fs.existsSync(mediaPath)) {
            foundPath = mediaPath;
            fs.unlinkSync(mediaPath);
            consoleLogger.log(`🗑️ Deleted media file: ${banner.media} from ${mediaPath}`);
            fileDeleted = true;
            break; // File found and deleted, exit loop
          }
        } catch (err) {
          consoleLogger.error(
            `⚠️ Failed to delete media file: ${mediaPath}`,
            {
              error: err.message,
              code: err.code,
            }
          );
          // Continue to next path or proceed with DB delete
        }
      }

      if (!fileDeleted) {
        consoleLogger.warn(
          `⚠️ Media file not found in any expected location: ${banner.media}`,
          {
            searchedPaths: possiblePaths,
            currentWorkingDirectory: process.cwd(),
            __dirname: __dirname,
          }
        );
        // Continue with DB delete even if file not found
        // This is acceptable - file might have been manually deleted or moved
      }
    }

    // Delete from database
    await db.query("DELETE FROM banners WHERE id = ?", [id]);

    consoleLogger.log(`✅ Banner deleted successfully ID: ${id}`);
    return sendSuccess(res, { id: parseInt(id) }, "Banner deleted successfully");
  } catch (error) {
    consoleLogger.error("❌ Error deleting banner:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      bannerId: id,
    });

    // Provide more specific error messages
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      return sendInternalError(res, error, "Database connection failed. Please contact administrator.");
    }

    if (error.code === 'ER_NO_SUCH_TABLE') {
      return sendInternalError(res, error, "Database configuration error. Please contact administrator.");
    }

    return sendInternalError(res, error, "Failed to delete banner. Please try again or contact support.");
  }
});

module.exports = router;
