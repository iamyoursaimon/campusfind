const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  role: { type: String, default: "CampusFind Student", trim: true, maxlength: 60 },
  text: { type: String, required: true, trim: true, maxlength: 280 },
  firebaseUID: { type: String, default: "" },
  studentId: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("CommunityPost", communityPostSchema);
