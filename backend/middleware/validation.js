/**
 * Validation Middleware
 * Provides reusable validation rules for common operations
 */

const { body, param, query, validationResult } = require("express-validator");
const { sendValidationError } = require("../utils/response");

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendValidationError(res, errors.array());
  }
  next();
};

/**
 * Validation rules for category parameter
 */
const validateCategory = [
  param("category")
    .isIn([
      "quality_education",
      "livelihood",
      "healthcare",
      "environment_sustainability",
      "integrated_development",
    ])
    .withMessage(
      "Invalid category. Must be one of: quality_education, livelihood, healthcare, environment_sustainability, integrated_development"
    ),
  handleValidationErrors,
];

/**
 * Validation rules for ID parameter
 */
const validateId = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  handleValidationErrors,
];

/**
 * Validation rules for creating/updating our-work items
 */
const validateOurWorkItem = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),

  body("content").optional().trim(),

  body("image_url")
    .optional()
    .trim()
    .isURL({ require_protocol: false })
    .withMessage("Image URL must be a valid URL"),

  body("video_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Video URL must be a valid URL"),

  body("meta_title")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Meta title must not exceed 255 characters"),

  body("meta_description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Meta description must not exceed 500 characters"),

  body("meta_keywords")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Meta keywords must not exceed 255 characters"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean"),

  body("display_order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("display_order must be a non-negative integer"),

  handleValidationErrors,
];

/**
 * Validation rules for authentication
 */
const validateLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  handleValidationErrors,
];

/**
 * Validation rules for registration
 */
const validateRegistration = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("role")
    .optional()
    .isIn(["viewer", "editor", "admin"])
    .withMessage("Role must be one of: viewer, editor, admin"),

  handleValidationErrors,
];

/**
 * Validation rules for pagination
 */
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  handleValidationErrors,
];

/**
 * Validation rules for status update
 */
const validateStatusUpdate = [
  body("is_active")
    .notEmpty()
    .withMessage("is_active is required")
    .isBoolean()
    .withMessage("is_active must be a boolean"),

  handleValidationErrors,
];

/**
 * Validation rules for display order update
 */
const validateDisplayOrder = [
  body("display_order")
    .notEmpty()
    .withMessage("display_order is required")
    .isInt({ min: 0 })
    .withMessage("display_order must be a non-negative integer"),

  handleValidationErrors,
];

const validatePasswordResetRequest = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  next();
};

const validatePasswordReset = (req, res, next) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({
      error: "Email, token, and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters long",
    });
  }

  next();
};

module.exports = {
  validateCategory,
  validateId,
  validateOurWorkItem,
  validateLogin,
  validateRegistration,
  validatePagination,
  validateStatusUpdate,
  validateDisplayOrder,
  handleValidationErrors,
  validatePasswordResetRequest,
  validatePasswordReset,
};
