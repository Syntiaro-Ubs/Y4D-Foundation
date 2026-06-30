const jwt = require("jsonwebtoken");
const db = require("../config/database");
const consoleLogger = require("../utils/logger");

const JWT_SECRET =
  process.env.JWT_SECRET || "your_fallback_secret_here_change_in_production";

/**
 * Middleware: Authenticate JWT token and check user status
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  consoleLogger.debug("Auth middleware called", { hasToken: !!token });

  if (!token) {
    consoleLogger.debug("No token provided");
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET);
    consoleLogger.debug("Token verified", { userId: decoded.id });

    // Check if user exists in DB
    const query = "SELECT id, username, role, status FROM users WHERE id = ?";
    const [results] = await db.query(query, [decoded.id]);

    if (!results || results.length === 0) {
      consoleLogger.warn("User not found in database", { userId: decoded.id });
      return res.status(403).json({ error: "User not found" });
    }

    const user = results[0];

    if (user.status !== "approved") {
      consoleLogger.warn("User not approved", { 
        userId: user.id, 
        username: user.username, 
        status: user.status 
      });
      return res.status(403).json({ error: "Account not approved" });
    }

    consoleLogger.debug("User authenticated successfully", { 
      userId: user.id, 
      username: user.username 
    });
    req.user = user;
    next();
  } catch (err) {
    consoleLogger.error("Token verification failed", { 
      message: err.message,
      name: err.name 
    });
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

/**
 * Middleware: Require specific roles
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

// Add this to middleware/auth.js
const checkPermission = (action, section, subSection = null) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Super admin has all permissions
      if (req.user.role === "super_admin") {
        return next();
      }

      let query = `
        SELECT id, user_id, section, sub_section, can_view, can_create, can_edit, can_delete, can_publish, created_at, updated_at FROM user_permissions 
        WHERE user_id = ? AND section = ? 
        AND (sub_section IS NULL OR sub_section = ?)
      `;
      const params = [userId, section, subSection];

      const [permissions] = await db.query(query, params);

      if (permissions.length === 0) {
        return res
          .status(403)
          .json({ error: "No permissions for this section" });
      }

      const userPerm = permissions[0];
      const hasPermission = userPerm[`can_${action}`];

      if (!hasPermission) {
        return res
          .status(403)
          .json({ error: `Insufficient permissions to ${action}` });
      }

      next();
    } catch (error) {
      consoleLogger.error("Permission check error", { 
        message: error.message,
        userId: req.user?.id 
      });
      res.status(500).json({ error: "Permission check failed" });
    }
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  checkPermission,
  JWT_SECRET,
};
