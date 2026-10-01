const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({
  path: path.join(__dirname, ".env")
});

const {
  connectDB,
  isMongoConnected,
  getMongoError
} = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const communityRoutes = require("./routes/communityRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const frontendPath = path.join(__dirname, "../frontend");

// CORS
app.use((req, res, next) => {
  const allowedOrigin =
    process.env.CLIENT_ORIGIN ||
    process.env.FRONTEND_ORIGIN ||
    "*";

  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Body parser
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/community", communityRoutes);

// Frontend
app.use(express.static(frontendPath));
app.use("/frontend", express.static(frontendPath));

// Health check
app.get("/api/health", (req, res) => {
  const mongo = isMongoConnected();

  res.json({
    success: true,
    server: true,
    mongo: mongo,
    database: mongo ? mongoose.connection.name : null,
    message: mongo
      ? "CampusFind and MongoDB Atlas are connected."
      : "CampusFind is running without MongoDB."
  });
});

// Status
app.get("/api/status", (req, res) => {
  const mongo = isMongoConnected();

  res.json({
    success: true,
    mongo: mongo,
    mode: mongo ? "mongodb" : "local",
    database: mongo ? mongoose.connection.name : null,
    error: mongo ? null : getMongoError(),
    message: mongo
      ? "MongoDB Atlas connected successfully."
      : "MongoDB Atlas is not connected."
  });
});

// Error handler
app.use((error, req, res, next) => {
  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error
  ) {
    return res.status(400).json({
      success: false,
      message: "Request body contains invalid JSON."
    });
  }

  if (req.path.startsWith("/api/")) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Unexpected API error."
    });
  }

  next(error);
});

// API 404
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API route not found"
    });
  }

  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("====================================");
      console.log("MongoDB Atlas connected");
      console.log("Database: " + mongoose.connection.name);
      console.log("CampusFind running at http://localhost:" + PORT);
      console.log("====================================");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    app.listen(PORT, () => {
      console.log("CampusFind running at http://localhost:" + PORT);
      console.log("MongoDB is unavailable.");
    });
  }
};

startServer();