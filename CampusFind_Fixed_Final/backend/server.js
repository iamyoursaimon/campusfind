const express = require("express");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env")
});

const { connectDB, isMongoConnected, getMongoError } = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const communityRoutes = require("./routes/communityRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "8mb" }));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/community", communityRoutes);

// Frontend
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/frontend", express.static(path.join(__dirname, "../frontend")));

// Health check
app.get("/api/health", (req, res) => {
  const mongo = isMongoConnected();

  res.json({
    success: true,
    server: true,
    mongo,
    database: mongo ? require("mongoose").connection.name || null : null,
    error: mongo ? null : getMongoError(),
    message: mongo
      ? "CampusFind + MongoDB Atlas are connected."
      : "CampusFind is running in local mode."
  });
});

// Status
app.get("/api/status", (req, res) => {
  const mongo = isMongoConnected();

  res.json({
    success: true,
    mongo,
    mode: mongo ? "mongodb" : "local",
    database: mongo
      ? require("mongoose").connection.name || "campusfind"
      : null,
    error: mongo ? null : getMongoError(),
    message: mongo
      ? "MongoDB Atlas connected."
      : "MongoDB Atlas is not connected. Check backend/.env, Atlas Network Access, and Database Access credentials."
  });
});

// Keep malformed JSON and unexpected API failures JSON-shaped for every client.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ success: false, message: "Request body contains invalid JSON." });
  }
  if (req.path.startsWith("/api/")) {
    return res.status(error.status || 500).json({ success: false, message: error.message || "Unexpected API error." });
  }
  return next(error);
});

// API 404
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API route not found"
    });
  }

  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`CampusFind running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    console.log("Starting server without MongoDB...");

    app.listen(PORT, () => {
      console.log(`CampusFind running at http://localhost:${PORT}`);
      console.log("MongoDB is currently unavailable.");
    });
  }
};

startServer();