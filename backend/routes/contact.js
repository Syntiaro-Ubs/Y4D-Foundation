const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const xss = require("xss"); // Prevent injected HTML/script

require("dotenv").config();

// --------------------------------------------------
// ENVIRONMENT VALIDATION
// --------------------------------------------------
const HR_EMAIL = process.env.HR_EMAIL;
const HR_EMAIL_PASSWORD = process.env.HR_EMAIL_PASSWORD;
const CORP_MAIL = process.env.CORP_MAIL;
const CORP_MAIL_PASSWORD = process.env.CORP_MAIL_PASSWORD;

if (!HR_EMAIL || !HR_EMAIL_PASSWORD) {
  console.error("❌ ERROR: HR_EMAIL or HR_EMAIL_PASSWORD missing in environment");
}

// --------------------------------------------------
// MAIL TRANSPORTER
// --------------------------------------------------
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: HR_EMAIL,
    pass: HR_EMAIL_PASSWORD,
  },
});

// Verify transporter at server start
transporter.verify((err) => {
  if (err) {
    console.error("❌ Email Transporter Error:", err);
  } else {
    console.log("📧 Email transporter is ready.");
  }
});

// --------------------------------------------------
// GLOBAL REUSABLE MAIL FUNCTION
// --------------------------------------------------
const sendMailSafe = async (options, res) => {
  try {
    await transporter.sendMail(options);
    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    return res.status(500).json({
      success: false,
      error: "Unable to send message at this time.",
    });
  }
};

// --------------------------------------------------
// Helper: Sanitize Inputs
// --------------------------------------------------
const clean = (value) => (value ? xss(value.trim()) : "");

// --------------------------------------------------
// CORPORATE PARTNERSHIP FORM
// --------------------------------------------------
router.post("/corporate-partnership", async (req, res) => {
  const companyName = clean(req.body.companyName);
  const email = clean(req.body.email);
  const contact = clean(req.body.contact);
  const details = clean(req.body.details);

  if (!companyName || !email || !contact) {
    return res.status(400).json({
      success: false,
      error: "Required fields missing.",
    });
  }

  return sendMailSafe(
    {
      from: email,
      to: CORP_MAIL,
      subject: "New Corporate Partnership Submission",
      html: `
        <h3>Corporate Partnership Inquiry</h3>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Details:</strong> ${details}</p>
      `,
    },
    res
  );
});

// --------------------------------------------------
// INTERNSHIP FORM
// --------------------------------------------------
router.post("/internship", async (req, res) => {
  const fullName = clean(req.body.fullName);
  const email = clean(req.body.email);
  const phone = clean(req.body.phone);
  const field = clean(req.body.field);
  const message = clean(req.body.message);

  if (!fullName || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: "Required fields missing.",
    });
  }

  return sendMailSafe(
    {
      from: email,
      to: HR_EMAIL,
      subject: "New Internship Application",
      html: `
        <h3>Internship Application</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Field:</strong> ${field}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    },
    res
  );
});

// --------------------------------------------------
// VOLUNTEER FORM
// --------------------------------------------------
router.post("/volunteer", async (req, res) => {
  const fullName = clean(req.body.fullName);
  const email = clean(req.body.email);
  const phone = clean(req.body.phone);
  const reason = clean(req.body.reason);

  if (!fullName || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: "Required fields missing.",
    });
  }

  return sendMailSafe(
    {
      from: email,
      to: HR_EMAIL,
      subject: "New Volunteer Registration",
      html: `
        <h3>Volunteer Registration</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Reason:</strong> ${reason}</p>
      `,
    },
    res
  );
});

// --------------------------------------------------
// GENERAL ENQUIRY FORM
// --------------------------------------------------
router.post("/enquiry", async (req, res) => {
  const firstName = clean(req.body.firstName);
  const lastName = clean(req.body.lastName);
  const email = clean(req.body.email);
  const phone = clean(req.body.phone);
  const message = clean(req.body.message);

  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: "Required fields missing.",
    });
  }

  return sendMailSafe(
    {
      from: email,
      to: HR_EMAIL,
      subject: "New General Enquiry",
      html: `
        <h3>General Enquiry</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    },
    res
  );
});

module.exports = router;
