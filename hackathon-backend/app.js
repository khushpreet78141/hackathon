import express from "express";
import cors from "cors";
import morgan from "morgan";

import { errorHandler } from "./src/middleware/errorHandler.js";
import analysisRoutes from "./src/routes/analysisRoutes.js";
import trendRoutes from "./src/routes/trendRoutes.js";


const app = express();

/*
========================
Global Middlewares
========================
*/

// JSON body parser
app.use(express.json({ limit: "10kb" }));

// Enable CORS
app.use(cors());

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