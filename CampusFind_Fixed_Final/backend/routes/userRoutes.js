const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { isMongoConnected } = require("../config/db");

const cleanCampus = value => (value || "GEC").replace(/ Campus$/i, "");
const validStudentId = value => /^\d{16}$/.test(String(value || ""));

router.post("/", async (req, res) => {
  if (!isMongoConnected()) return res.status(503).json({ success: false, message: "MongoDB Atlas is not connected." });
  try {
    const data = { ...req.body, campus: cleanCampus(req.body.campus) };
    const { firebaseUID, fullName, email, campus, studentId } = data;
    if (!firebaseUID || !fullName || !email || !campus || !validStudentId(studentId)) {
      return res.status(400).json({ success: false, message: "Name, email, campus, Firebase UID and a valid 16-digit student ID are required." });
    }
    let user = await User.findOne({ firebaseUID });
    if (!user) user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      Object.assign(user, data, { campus, studentId: String(studentId) });
      await user.save();
      return res.json({ success: true, message: "User updated.", user });
    }
    user = await User.create({ ...data, studentId: String(studentId) });
    res.status(201).json({ success: true, message: "User saved successfully.", user });
  } catch (error) {
    const message = error.code === 11000 ? "That student ID or email is already registered." : error.message;
    res.status(500).json({ success: false, message });
  }
});

router.get("/profile/:firebaseUID", async (req, res) => {
  if (!isMongoConnected()) return res.status(503).json({ success: false, message: "MongoDB Atlas is not connected." });
  try {
    const user = await User.findOne({ firebaseUID: req.params.firebaseUID });
    if (!user) return res.status(404).json({ success: false, message: "Profile not found." });
    res.json({ success: true, user });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.get("/by-student-id/:studentId", async (req, res) => {
  if (!isMongoConnected()) return res.status(503).json({success:false,message:"MongoDB Atlas is not connected."});
  try {
    const id = String(req.params.studentId);
    if (!validStudentId(id)) return res.status(400).json({ success: false, message: "Student ID must be 16 digits." });
    const user = await User.findOne({ studentId: id });
    if (!user) return res.status(404).json({ success: false, message: "Student ID not found." });
    res.json({ success: true, user });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.put("/profile", async (req, res) => {
  if (!isMongoConnected()) return res.status(503).json({success:false,message:"MongoDB Atlas is not connected."});
  try {
    const data = { ...req.body, campus: cleanCampus(req.body.campus) };
    const { firebaseUID, fullName, email, campus, studentId } = data;
    if (!fullName || !email || !campus || !validStudentId(studentId)) {
      return res.status(400).json({ success: false, message: "Name, email, campus and valid 16-digit student ID are required." });
    }
    const filter = firebaseUID ? { firebaseUID } : { email: email.toLowerCase() };
    let user = await User.findOne(filter);
    if (user) {
      Object.assign(user, data, { campus, studentId: String(studentId) });
      await user.save();
    } else {
      user = await User.create({ ...data, firebaseUID: firebaseUID || `local-${Date.now()}`, studentId: String(studentId) });
    }
    res.json({ success: true, user });
  } catch (error) {
    const message = error.code === 11000 ? "That student ID or email is already in use." : error.message;
    res.status(500).json({ success: false, message });
  }
});

module.exports = router;
