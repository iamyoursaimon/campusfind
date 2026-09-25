const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true, trim: true },
  studentId: { type: String, required: true, unique: true, index: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, default: "" },
  campus: { type: String, required: true, enum: ["GEC", "Hazari Line", "WASA"] },
  location: { type: String, trim: true, default: "" },
  about: { type: String, trim: true, maxlength: 400, default: "" },
  profileImage: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
