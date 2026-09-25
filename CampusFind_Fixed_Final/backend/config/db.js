const mongoose = require("mongoose");

let connected = false;
let connecting = false;
let lastError = "";

async function connectDB() {
  // Already connected
  if (connected || mongoose.connection.readyState === 1) {
    return true;
  }

  // Another connection attempt is already running
  if (connecting) {
    return false;
  }

  const uri = process.env.MONGODB_URI;

  // Check MongoDB URI
  if (!uri || uri.includes("YOUR_MONGODB_URI")) {
    lastError = "MongoDB URI is not configured.";
    console.warn("⚠️", lastError);
    return false;
  }

  connecting = true;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });

    connected = true;
    lastError = "";

    console.log("✅ MongoDB Atlas connected successfully.");
    console.log("📁 Database:", mongoose.connection.name);

    return true;
  } catch (error) {
    connected = false;
    lastError = error.message;

    console.error(
      "❌ MongoDB Atlas connection failed:",
      error.message
    );

    return false;
  } finally {
    connecting = false;
  }
}

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

mongoose.connection.on("connected", () => {
  connected = true;
  console.log("✅ MongoDB Atlas connection is ready.");
});

mongoose.connection.on("disconnected", () => {
  connected = false;
  console.warn("⚠️ MongoDB Atlas disconnected.");
});

mongoose.connection.on("error", (error) => {
  lastError = error.message;
  console.error("❌ MongoDB error:", error.message);
});

function getMongoError() {
  return lastError;
}

module.exports = {
  connectDB,
  isMongoConnected,
  getMongoError
};