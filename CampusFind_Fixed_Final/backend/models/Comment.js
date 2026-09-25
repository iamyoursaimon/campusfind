const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true, index: true },
  text: { type: String, required: true, trim: true, maxlength: 500 },
  name: { type: String, default: "CampusFind Student", trim: true, maxlength: 60 },
  email: { type: String, default: "", trim: true },
  firebaseUID: { type: String, default: "", index: true },
  studentId: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
