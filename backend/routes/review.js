const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { reviewResume } = require("../utils/gemini");

const router = express.Router();

// Store uploaded files in memory (no disk storage needed)
const upload = multer({ storage: multer.memoryStorage() });

// ─────────────────────────────────────────
// Route 1: Upload a PDF file
// POST /api/review/upload
// ─────────────────────────────────────────
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract text from the PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from PDF" });
    }

    // Get job role from request body (default to Software Engineer)
    const jobRole = req.body.jobRole || "Software Engineer";

    // Send to Gemini for review
    const result = await reviewResume(resumeText, jobRole);

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("Upload route error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// Route 2: Paste resume as plain text
// POST /api/review/text
// ─────────────────────────────────────────
router.post("/text", async (req, res) => {
  try {
    const { resumeText, jobRole } = req.body;

    // Validate input
    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Resume text is required" });
    }

    const role = jobRole || "Software Engineer";

    // Send to Gemini for review
    const result = await reviewResume(resumeText, role);

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("Text route error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;