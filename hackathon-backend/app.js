import express from "express";
import cors from "cors";
import morgan from "morgan";

import { errorHandler } from "./src/middleware/errorHandler.js";
import analysisRoutes from "./src/routes/analysisRoutes.js";
import trendRoutes from "./src/routes/trendRoutes.js";
import imageAnalysisRoutes from "./src/routes/imageAnalysisRoutes.js";

import dotenv from "dotenv";
dotenv.config();
const app = express();
import authRoute from './src/routes/authRoutes.js'

/*
========================
Global Middlewares
========================
*/

// JSON body parser
app.use(express.json({ limit: "10kb" }));

// Enable CORS
app.use(cors(
  {
    origin: true,
    credentials: true
  }
));

// HTTP request logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/*
========================
Health Check
========================
*/

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server running"
  });
});

/*
========================
Routes
========================
*/

app.use("/api/analysis", analysisRoutes);
app.use("/api/trends", trendRoutes);
app.use('/api/auth', authRoute)
app.use('/api/image-analysis', imageAnalysisRoutes);

/*
========================
404 Handler
========================
*/

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

/*
========================
Global Error Handler
========================
*/

app.use(errorHandler);

export default app;