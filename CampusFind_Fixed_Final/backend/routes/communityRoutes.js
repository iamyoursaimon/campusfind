const express = require("express");
const CommunityPost = require("../models/CommunityPost");
const router = express.Router();
const { isMongoConnected } = require("../config/db");

router.get("/", async (req, res) => {
  if (!isMongoConnected()) return res.status(503).json({ success: false, message: "MongoDB Atlas is not connected.", reports: [], posts: [] });
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50).lean();
    res.json({ success: true, posts });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/", async (req, res) => {
  if (!isMongoConnected()) return res.status(503).json({ success: false, message: "MongoDB Atlas is not connected." });
  try {
    const { name, role, text, firebaseUID, studentId, profileImage } = req.body;
    if (!name || !text) return res.status(400).json({ success: false, message: "Name and comment are required." });
    const post = await CommunityPost.create({ name, role: role || "CampusFind Student", text, firebaseUID: firebaseUID || "", studentId: studentId || "", profileImage: profileImage || "" });
    res.status(201).json({ success: true, post });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
