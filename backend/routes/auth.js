const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const logger = require("../services/logger");
const consoleLogger = require("../utils/logger");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  sendError,
  sendSuccess,
  sendUnauthorized,
  sendInternalError,
} = require("../utils/response");
const {
  validateLogin,
  validateRegistration,
} = require("../middleware/validation");

const router = express.Router();

// ===============================
// LOGIN
// ===============================
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  const { username, password } = req.body;
  consoleLogger.log("🔐 Login attempt:", {
    username,
    password: password ? "***" : "missing",
  });

  try {
    // Optimized: Select only needed fields
    const query =
      "SELECT id, username, email, password, role, status, created_at FROM users WHERE username = ? OR email = ?";
    consoleLogger.log("🔍 Searching for user:", username);

    const [results] = await db.query(query, [username, username]);
    consoleLogger.log(`📊 Found ${results.length} users matching: ${username}`);

    if (results.length === 0) {
      const attemptQuery =
        "INSERT INTO login_attempts (ip_address, user_agent, success) VALUES (?, ?, FALSE)";
      try {
        await db.query(attemptQuery, [req.ip, req.get("User-Agent")]);
      } catch (dbError) {
        consoleLogger.error("Failed to log login attempt:", dbError);
        // Continue even if logging fails
      }

      // Log login attempt (non-blocking)
      logger.logLogin(
        null,
        username,
        req.ip || req.connection.remoteAddress,
        req.get("User-Agent"),
        false,
        "User not found"
      ).catch((logError) => {
        consoleLogger.error("Failed to log login attempt:", logError);
        // Don't break login flow if logging fails
      });

      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    consoleLogger.log("👤 User found:", {
      id: user.id,
      username: user.username,
      status: user.status,
      role: user.role,
    });

    // Check approval
    if (user.status !== "approved") {
      // Log warning (non-blocking)
      logger.warning(
        "authentication",
        `Login attempt by unapproved user: ${user.username}`,
        {
          type: logger.LogType.LOGIN,
          user_id: user.id,
          ip_address: req.ip || req.connection.remoteAddress,
          metadata: { status: user.status },
        }
      ).catch((logError) => {
        consoleLogger.error("Failed to log warning:", logError);
      });

      return sendError(
        res,
        401,
        "Account not approved. Please contact administrator."
      );
    }

    // Check password
    consoleLogger.log("🔑 Checking password...");
    const validPassword = await bcrypt.compare(password, user.password);
    consoleLogger.log("Password valid:", validPassword);

    if (!validPassword) {
      const attemptQuery =
        "INSERT INTO login_attempts (user_id, ip_address, user_agent, success) VALUES (?, ?, ?, FALSE)";
      try {
        await db.query(attemptQuery, [user.id, req.ip, req.get("User-Agent")]);
      } catch (dbError) {
        consoleLogger.error("Failed to log login attempt:", dbError);
        // Continue even if logging fails
      }

      // Log login attempt (non-blocking)
      logger.logLogin(
        user.id,
        user.username,
        req.ip || req.connection.remoteAddress,
        req.get("User-Agent"),
        false,
        "Invalid password"
      ).catch((logError) => {
        consoleLogger.error("Failed to log login attempt:", logError);
        // Don't break login flow if logging fails
      });

      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Log successful login attempt (non-blocking)
    const attemptQuery =
      "INSERT INTO login_attempts (user_id, ip_address, user_agent, success) VALUES (?, ?, ?, TRUE)";
    try {
      await db.query(attemptQuery, [user.id, req.ip, req.get("User-Agent")]);
    } catch (dbError) {
      consoleLogger.error("Failed to log successful login attempt:", dbError);
      // Continue even if logging fails
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_here",
      { expiresIn: "24h" }
    );

    // Log successful login (non-blocking)
    logger.logLogin(
      user.id,
      user.username,
      req.ip || req.connection.remoteAddress,
      req.get("User-Agent"),
      true
    ).catch((logError) => {
      consoleLogger.error("Failed to log successful login:", logError);
      // Don't break login flow if logging fails
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    consoleLogger.error("❌ Login error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    });
    
    // Provide more specific error messages
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      return sendInternalError(res, error, "Database connection failed. Please contact administrator.");
    }
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return sendInternalError(res, error, "Database configuration error. Please contact administrator.");
    }
    
    // Generic error
    return sendInternalError(res, error, "Login failed. Please try again or contact support.");
  }
});

// ===============================
// REGISTER
// ===============================
router.post(
  "/register",
  authLimiter,
  validateRegistration,
  async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
      const checkQuery = "SELECT id FROM users WHERE username = ? OR email = ?";
      const [existing] = await db.query(checkQuery, [username, email]);

      if (existing.length > 0) {
        return sendError(res, 409, "Username or email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userRole = role || "viewer";

      const insertQuery =
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
      const [result] = await db.query(insertQuery, [
        username,
        email,
        hashedPassword,
        userRole,
      ]);

      return sendSuccess(
        res,
        {
          userId: result.insertId,
        },
        "User registered successfully. Waiting for admin approval.",
        201
      );
    } catch (error) {
      return sendInternalError(res, error, "Registration failed");
    }
  }
);

// ===============================
// VERIFY TOKEN
// ===============================
router.get("/verify", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_here"
    );

    const query =
      'SELECT id, username, email, role, status FROM users WHERE id = ? AND status = "approved"';
    const [results] = await db.query(query, [decoded.id]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json({ valid: true, user: results[0] });
  } catch (error) {
    consoleLogger.error("❌ Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

// ===============================
// PASSWORD RESET REQUEST (Send OTP)
// ===============================
router.post("/request-password-reset", authLimiter, async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const [users] = await db.query(
      "SELECT id, username, email, status FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      // For security, don't reveal if email exists
      return sendSuccess(
        res,
        {},
        "If the email exists, reset instructions will be sent"
      );
    }

    const user = users[0];

    // Check if user is approved
    if (user.status !== "approved") {
      return sendError(res, 403, "Account not approved");
    }

    // Generate reset token (6-digit OTP)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Store reset token in database
    await db.query(
      "INSERT INTO password_resets (user_id, reset_token, token_expiry) VALUES (?, ?, ?)",
      [user.id, resetToken, tokenExpiry]
    );

    // Send email with OTP
    await sendResetEmail(user.email, user.username, resetToken);

    // Log the reset request
    await logger.info(
      "authentication",
      `Password reset requested for user: ${user.username}`,
      {
        type: logger.LogType.PASSWORD_RESET,
        user_id: user.id,
        ip_address: req.ip,
      }
    );

    return sendSuccess(res, {
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    consoleLogger.error("❌ Password reset request error:", error);
    return sendInternalError(res, error, "Failed to process reset request");
  }
});

// ===============================
// VERIFY RESET TOKEN
// ===============================
router.post("/verify-reset-token", authLimiter, async (req, res) => {
  const { email, token } = req.body;

  try {
    // Find user
    const [users] = await db.query(
      'SELECT id FROM users WHERE email = ? AND status = "approved"',
      [email]
    );

    if (users.length === 0) {
      return sendError(res, 404, "User not found or not approved");
    }

    const user = users[0];

    // Check if token is valid and not expired
    const [tokens] = await db.query(
      "SELECT id, token_expiry FROM password_resets WHERE user_id = ? AND reset_token = ? AND used = FALSE",
      [user.id, token]
    );

    if (tokens.length === 0) {
      return sendError(res, 401, "Invalid or expired token");
    }

    const resetToken = tokens[0];

    // Check if token is expired
    if (new Date(resetToken.token_expiry) < new Date()) {
      await db.query("UPDATE password_resets SET used = TRUE WHERE id = ?", [
        resetToken.id,
      ]);
      return sendError(res, 401, "Token has expired");
    }

    return sendSuccess(res, {
      valid: true,
      success: true,
      message: "Token is valid",
    });
  } catch (error) {
    consoleLogger.error("❌ Token verification error:", error);
    return sendInternalError(res, error, "Failed to verify token");
  }
});

// ===============================
// RESET PASSWORD
// ===============================
// In routes/auth.js, update the reset-password endpoint:

router.post("/reset-password", authLimiter, async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    // Find user
    const [users] = await db.query(
      'SELECT id FROM users WHERE email = ? AND status = "approved"',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found or account not approved",
      });
    }

    const user = users[0];

    // Verify token is valid and not expired
    const [tokens] = await db.query(
      `SELECT id FROM password_resets 
       WHERE user_id = ? 
       AND reset_token = ? 
       AND used = FALSE 
       AND token_expiry > NOW()`,
      [user.id, token]
    );

    if (tokens.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired OTP. Please request a new one.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in users table
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      user.id,
    ]);

    // Mark token as used
    await db.query("UPDATE password_resets SET used = TRUE WHERE id = ?", [
      tokens[0].id,
    ]);

    // Log password reset
    await logger.info(
      "authentication",
      `Password reset successful for user: ${email}`,
      {
        type: logger.LogType.PASSWORD_RESET,
        user_id: user.id,
        ip_address: req.ip,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    consoleLogger.error("❌ Password reset error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to reset password. Please try again.",
    });
  }
});

// ===============================
// EMAIL SERVICE FUNCTION
// ===============================
const sendResetEmail = async (email, username, token) => {
  try {
    const nodemailer = require("nodemailer");

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const resetLink = `${
      process.env.FRONTEND_URL
    }/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Y4D Foundation" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to: email,
      subject: "Password Reset Request - Y4D Foundation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #fb6401 0%, #fc7c27ff 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Y4D Foundation</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333;">Password Reset Request</h2>
            
            <p>Hello ${username},</p>
            
            <p>We received a request to reset your password for your Y4D Foundation account.</p>
            
            <div style="background-color: white; border: 2px solid #fb6401; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h3 style="color: #004715ff; margin: 0 0 10px 0;">Your OTP Code:</h3>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #fb6401; margin: 15px 0;">
                ${token}
              </div>
              <p style="color: #666; font-size: 14px; margin: 10px 0;">
                This code will expire in 15 minutes
              </p>
            </div>
            
            <p>Alternatively, you can click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(135deg, #fb6401 0%, #fb6401 100%); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold;
                        display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Y4D Foundation. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `Password Reset Request\n\nHello ${username},\n\nWe received a request to reset your password for your Y4D Foundation account.\n\nYour OTP Code: ${token}\nThis code will expire in 15 minutes.\n\nIf you didn't request this password reset, please ignore this email.\n\nBest regards,\nY4D Foundation Team`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    consoleLogger.log(`📧 Password reset email sent to ${email}`);
  } catch (error) {
    consoleLogger.error("❌ Email sending error:", error);
    throw new Error("Failed to send reset email");
  }
};

module.exports = router;
