// routes/linkedin.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const ORGANIZATION_ID = process.env.LINKEDIN_ORGANIZATION_ID;

router.get("/latest-post", async (req, res) => {
  try {
    if (!LINKEDIN_ACCESS_TOKEN || !ORGANIZATION_ID) {
      return res.status(500).json({
        error:
          "LinkedIn config missing. Check LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORGANIZATION_ID",
      });
    }

    const url = `https://api.linkedin.com/v2/posts?author=urn:li:organization:${ORGANIZATION_ID}&q=author&sortBy=LAST_MODIFIED&count=1`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    const elements = response.data.elements;

    if (!elements || elements.length === 0) {
      return res.status(404).json({ error: "No posts found" });
    }

    const postUrn = elements[0].id; // "urn:li:post:1234567890123"

    return res.json({ urn: postUrn });
  } catch (err) {
    console.error("LinkedIn API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "LinkedIn API request failed" });
  }
});

module.exports = router;
