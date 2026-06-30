const express = require("express");
const db = require("../config/database");
const bcrypt = require("bcrypt");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Submit registration request
router.post("/request", authLimiter, async (req, res) => {
  try {
    const { name, email, mobile_number, address, password } = req.body;

    console.log("Registration request received:", {
      name,
      email,
      mobile_number,
    });

    if (!name || !email || !mobile_number || !address || !password) {
      return res.status(400).json({
        error:
          "All fields are required: name, email, mobile_number, address, password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    const [existingUser] = await db.query(
      'SELECT id FROM users WHERE email = ? UNION SELECT id FROM registration_requests WHERE email = ? AND status = "pending"',
      [email, email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        error: "Email already exists or has pending registration",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO registration_requests (name, email, mobile_number, address, password_hash) VALUES (?, ?, ?, ?, ?)",
      [name, email, mobile_number, address, hashedPassword]
    );

    try {
      const [admins] = await db.query(
        'SELECT id FROM users WHERE role IN ("super_admin", "admin")'
      );
      const notificationMessage = `New registration request from ${name} (${email})`;

      for (const admin of admins) {
        await db.query(
          "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
          [admin.id, "New Registration Request", notificationMessage, "warning"]
        );
      }
    } catch (notificationError) {
      console.error("Error creating notifications:", notificationError);
    }

    res.status(201).json({
      message: "Registration request submitted. Waiting for admin approval.",
      requestId: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      details: error.message,
      sqlMessage: error.sqlMessage,
    });
  }
});
// Get all registration requests (Admin only)
router.get("/requests", async (req, res) => {
  try {
    const [requests] = await db.query(
      "SELECT id, name, email, mobile_number, address, password_hash, status, created_at, updated_at FROM registration_requests ORDER BY created_at DESC"
    );
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({
      error: "Failed to fetch registration requests",
      details: error.message,
    });
  }
});

// Approve registration request (Admin only)
router.post("/requests/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role = "viewer" } = req.body;

    console.log("Approving registration request:", { id, username, role });

    if (!username) {
      return res.status(400).json({
        error: "Username is required for approval",
      });
    }

    const [requests] = await db.query(
      'SELECT id, name, email, mobile_number, address, password_hash, status, created_at, updated_at FROM registration_requests WHERE id = ? AND status = "pending"',
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        error: "Request not found or already processed",
      });
    }

    const request = requests[0];

    const [existingUsername] = await db.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existingUsername.length > 0) {
      return res.status(409).json({
        error: "Username already exists",
      });
    }

    const [userResult] = await db.query(
      'INSERT INTO users (username, email, password, role, mobile_number, address, status) VALUES (?, ?, ?, ?, ?, ?, "approved")',
      [
        username,
        request.email,
        request.password_hash,
        role,
        request.mobile_number,
        request.address,
      ]
    );

    await db.query(
      'UPDATE registration_requests SET status = "approved" WHERE id = ?',
      [id]
    );

    try {
      await db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
        [
          userResult.insertId,
          "Account Approved",
          "Your account has been approved by administrator. You can now login.",
          "success",
        ]
      );
    } catch (notificationError) {
      console.error("Error creating user notification:", notificationError);
    }

    res.json({
      message: "Registration approved successfully",
      userId: userResult.insertId,
    });
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({
      error: "Approval failed",
      details: error.message,
      sqlMessage: error.sqlMessage,
    });
  }
});

// Reject registration request (Admin only)
router.post("/requests/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const [result] = await db.query(
      'UPDATE registration_requests SET status = "rejected" WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({
      message: "Registration request rejected",
      reason: reason || "No reason provided",
    });
  } catch (error) {
    console.error("Rejection error:", error);
    res.status(500).json({
      error: "Rejection failed",
      details: error.message,
    });
  }
});

// Get registration request statistics
router.get("/stats", async (req, res) => {
  try {
    const [total] = await db.query(
      "SELECT COUNT(*) as total FROM registration_requests"
    );
    const [pending] = await db.query(
      'SELECT COUNT(*) as pending FROM registration_requests WHERE status = "pending"'
    );
    const [approved] = await db.query(
      'SELECT COUNT(*) as approved FROM registration_requests WHERE status = "approved"'
    );
    const [rejected] = await db.query(
      'SELECT COUNT(*) as rejected FROM registration_requests WHERE status = "rejected"'
    );

    res.json({
      total: total[0].total,
      pending: pending[0].pending,
      approved: approved[0].approved,
      rejected: rejected[0].rejected,
    });
  } catch (error) {
    console.error("Error fetching registration stats:", error);
    res.status(500).json({
      error: "Failed to fetch registration statistics",
      details: error.message,
    });
  }
});

module.exports = router;
