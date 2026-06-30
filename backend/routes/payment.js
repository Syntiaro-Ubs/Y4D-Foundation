const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const db = require("../config/database");
const router = express.Router();
const { sendDonationMail } = require("../services/donationMail");
/* Razorpay Instance (Secure)
 * Use backend-only environment variables (do NOT expose secret to frontend)
 */
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID?.trim();
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET?.trim();
const CORP_MAIL = process.env.CORP_MAIL;
const CORP_MAIL_PASSWORD = process.env.CORP_MAIL_PASSWORD;

let razorpay = null;

if (
  !RAZORPAY_KEY_ID ||
  !RAZORPAY_SECRET ||
  RAZORPAY_KEY_ID === "" ||
  RAZORPAY_SECRET === ""
) {
  console.warn("⚠️  Razorpay ENV variables missing or empty! Payment routes will be disabled.");
  console.warn(
    "   Set RAZORPAY_KEY_ID and RAZORPAY_SECRET in your backend .env file to enable payment functionality."
  );
} else {
  try {
    razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_SECRET,
    });
    console.log("✅ Razorpay initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing Razorpay:", error.message);
    razorpay = null;
  }
}

let mailTransporter = null;
if (!CORP_MAIL || !CORP_MAIL_PASSWORD) {
  console.warn("⚠️ CORP_MAIL or CORP_MAIL_PASSWORD missing. Donation receipts will not be emailed.");
} else {
  mailTransporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: CORP_MAIL,
      pass: CORP_MAIL_PASSWORD,
    },
  });
}

/* ---------------------------
     1. Create Order (POST)
----------------------------- */
router.post(
  "/create-order",
  [
    body("amount")
      .trim()
      .notEmpty()
      .withMessage("Amount is required")
      .toFloat()
      .isFloat({ min: 1 })
      .withMessage("Amount must be at least ₹1"),
    body("name")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .trim()
      .isLength({ max: 255 })
      .withMessage("Name must be less than 255 characters"),
    body("email")
      .optional({ nullable: true, checkFalsy: true })
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
    body("pan")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .trim()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
      .withMessage("PAN must be in format: ABCDE1234F"),
    body("message")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Message must be less than 1000 characters"),
  ],
  async (req, res) => {
    try {
      // Check if Razorpay is initialized
      if (!razorpay) {
        return res.status(503).json({
          success: false,
          message: "Payment service is not configured. Please contact administrator.",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ success: false, errors: errors.array() });
      }

      const { amount, name, email, pan, message } = req.body;

      const cleanAmount = parseFloat(amount);
      if (isNaN(cleanAmount) || cleanAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid donation amount. Amount must be greater than 0.",
        });
      }

      // Validate maximum amount (optional: set a reasonable limit)
      const MAX_AMOUNT = 10000000; // 1 crore INR
      if (cleanAmount > MAX_AMOUNT) {
        return res.status(400).json({
          success: false,
          message: `Donation amount exceeds maximum limit of ₹${MAX_AMOUNT.toLocaleString("en-IN")}`,
        });
      }

      // Prepare order options
      const options = {
        amount: Math.round(cleanAmount * 100), // Convert to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        notes: {
          name: name || "",
          email: email || "",
          pan: pan || "",
          message: message || "",
        },
      };

      // Create Razorpay order
      let order;
      try {
        order = await razorpay.orders.create(options);
      } catch (razorpayError) {
        console.error("❌ Razorpay order creation error:", razorpayError);
        return res.status(500).json({
          success: false,
          message: "Failed to create payment order. Please try again.",
        });
      }

      return res.status(201).json({
        success: true,
        key: RAZORPAY_KEY_ID,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
          created_at: order.created_at,
        },
      });
    } catch (error) {
      console.error("❌ Error creating Razorpay order:", error);
      // Don't expose internal error details to client
      const errorMessage =
        error.error?.description ||
        error.message ||
        "Failed to create payment order";
      return res.status(500).json({
        success: false,
        message: "Failed to create order. Please try again later.",
      });
    }
  }
);

router.post(
  "/verify-payment",
  [
    body("razorpay_payment_id")
      .trim()
      .notEmpty()
      .withMessage("razorpay_payment_id is required"),
    body("razorpay_order_id")
      .trim()
      .notEmpty()
      .withMessage("razorpay_order_id is required"),
    body("razorpay_signature")
      .trim()
      .notEmpty()
      .withMessage("razorpay_signature is required"),
  ],
  async (req, res) => {
    try {
      // Check if Razorpay is initialized
      if (!razorpay || !RAZORPAY_SECRET) {
        return res.status(503).json({
          success: false,
          message: "Payment service is not configured. Please contact administrator.",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;

      // Validate required fields
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Missing required payment verification fields",
        });
      }

      // Verify signature
      const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSign = crypto
        .createHmac("sha256", RAZORPAY_SECRET)
        .update(sign)
        .digest("hex");

      if (expectedSign !== razorpay_signature) {
        console.error("❌ Payment signature mismatch:", {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        });
        return res.status(400).json({
          success: false,
          message: "Payment signature verification failed",
        });
      }

      // Fetch order details from Razorpay
      let order;
      try {
        order = await razorpay.orders.fetch(razorpay_order_id);
      } catch (error) {
        console.error("❌ Error fetching Razorpay order:", error.message);
        return res.status(400).json({
          success: false,
          message: "Invalid order ID or order not found",
        });
      }

      // Check if order is already processed (optional: check database for duplicate)
      const checkQuery = `SELECT id FROM transaction_logs WHERE payment_id = ? OR transaction_id = ?`;
      const [existing] = await db.query(checkQuery, [
        razorpay_payment_id,
        razorpay_order_id,
      ]);

      if (existing && existing.length > 0) {
        console.warn("⚠️ Duplicate payment verification attempt:", {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        });
        return res.json({
          success: true,
          message: "Payment already verified",
          paymentId: razorpay_payment_id,
        });
      }

      const donor = order.notes || {};
      const amount = Number(order.amount) / 100;

      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment amount",
        });
      }

      // Insert transaction into database
      const insertQuery = `
        INSERT INTO transaction_logs
        (user_name, email, pan_number, amount, message, payment_method, status, payment_id, transaction_id, utr, masked_card_number, card_expiry)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      try {
        await db.query(insertQuery, [
          donor?.name || null,
          donor?.email || null,
          donor?.pan || null,
          amount,
          donor?.message || null,
          "Razorpay",
          "success",
          razorpay_payment_id,
          razorpay_order_id,
          null, // utr (need webhook for UPI)
          null, // masked_card_number (also webhook)
          null, // card_expiry (also webhook)
        ]);
      } catch (dbError) {
        console.error("❌ Database error during transaction log:", dbError);
        // Don't fail the payment verification if DB insert fails
        // Payment is already verified, just log the error
      }

      // Send email receipt (non-blocking)
      if (donor?.email) {
        sendDonationMail({
          name: donor?.name,
          email: donor?.email,
          amount,
          paymentId: razorpay_payment_id,
        }).catch((emailError) => {
          console.error("❌ Failed to send donation email:", emailError);
          // Don't fail payment verification if email fails
        });
      }

      return res.json({
        success: true,
        paymentId: razorpay_payment_id,
      });
    } catch (error) {
      console.error("❌ Payment verification error:", error);
      return res.status(500).json({
        success: false,
        message: "Payment verification failed. Please contact support if payment was deducted.",
      });
    }
  }
);

router.get("/key", (req, res) => {
  try {
    if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.trim() === "") {
      return res.status(500).json({
        success: false,
        message: "Razorpay key not configured. Please contact administrator.",
      });
    }

    return res.json({
      success: true,
      key: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Error retrieving Razorpay key:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve payment configuration",
    });
  }
});
module.exports = router;
