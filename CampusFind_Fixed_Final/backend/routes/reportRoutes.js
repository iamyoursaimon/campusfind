const express = require("express");
const Report = require("../models/Report");
const Comment = require("../models/Comment");
const router = express.Router();
const { isMongoConnected } = require("../config/db");

router.get("/", async (req, res) => {
  if (!isMongoConnected()) return res.status(503).json({ success: false, message: "MongoDB Atlas is not connected.", reports: [], posts: [] });
  try {
    const reports = await Report.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, reports });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/", async (req, res) => {
  if (!isMongoConnected()) return res.status(503).json({ success: false, message: "MongoDB Atlas is not connected." });
  try {
    const { status, title, category, campus, location, description, email, reporterName, studentId, firebaseUID, image } = req.body;
    if (!status || !title || !campus || !location) return res.status(400).json({ success: false, message: "Required fields are missing." });
    const report = await Report.create({ status, title, category, campus: String(campus).replace(/ Campus$/i, ""), location, description, email, reporterName, studentId, firebaseUID, image });
    res.status(201).json({ success: true, report });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/:reportId/comments", async (req, res) => {
  if (!isMongoConnected()) return res.status(503).json({ success: false, message: "MongoDB Atlas is not connected.", comments: [] });
  try {
    const comments = await Comment.find({ reportId: req.params.reportId }).sort({ createdAt: 1 }).lean();
    res.json({ success: true, comments });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid report ID or comment query." });
  }
});

router.post("/:reportId/comments", async (req, res) => {
  if (!isMongoConnected()) return res.status(503).json({ success: false, message: "MongoDB Atlas is not connected." });
  try {
    const { text, name, email, firebaseUID, studentId } = req.body;
    if (!text || !String(text).trim()) return res.status(400).json({ success: false, message: "Comment text is required." });
    const report = await Report.exists({ _id: req.params.reportId });
    if (!report) return res.status(404).json({ success: false, message: "Report not found." });
    const comment = await Comment.create({ reportId: req.params.reportId, text, name, email, firebaseUID, studentId });
    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid report ID or comment data." });
  }
});

module.exports = router;
