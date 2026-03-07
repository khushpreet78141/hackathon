// src/routes/imageAnalysisRoutes.js
import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { analyzeImage } from "../Controllers/imageAnalysisController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * POST /api/image-analysis
 * Upload an image for fraud / spam detection
 */
router.post(
    "/",
    upload.single("image"),
    asyncHandler(analyzeImage)
);

export default router;
