//import dotenv from "dotenv";
//dotenv.config();
import 'dotenv/config'
import mongoose from "mongoose";
import app from "./app.js";


/*
========================
Database Connection
========================
*/

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed");

    process.exit(1);
  }
};

/*
========================
Start Server
========================
*/

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();