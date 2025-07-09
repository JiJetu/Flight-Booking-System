const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("MongoDB connected Successfully...");
  } catch (err) {
    console.error("❌ MongoDB connection error", err);
    process.exit(1);
  }
};

module.exports = connectDB;
