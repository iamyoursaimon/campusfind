const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  status: { type: String, enum: ["lost", "found"], required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, default: "Other" },
  campus: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  email: { type: String, default: "" },
  reporterName: { type: String, default: "CampusFind Student" },
  studentId: { type: String, default: "" },
  firebaseUID: { type: String, default: "" },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
