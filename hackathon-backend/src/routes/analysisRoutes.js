import express from "express";
import asyncHandler from "../utils/asyncHandler.js";

import {
  analyzeText,
  getUserAnalyses,
  getSingleAnalysis,
  deleteAnalysis
} from "../controllers/analysisController.js";

import { analyzeScreenshot } from "../controllers/screenshotController.js";

import upload from "../middleware/upload.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/analysis
 * Run AI manipulation analysis on TEXT
 */
router.post(
  "/",
  asyncHandler(analyzeText)
);

/**
 * POST /api/analysis/screenshot
 * Run AI manipulation analysis on SCREENSHOT
 */
router.post(
  "/screenshot",
  upload.single("image"),
  asyncHandler(analyzeScreenshot)
);

/**
 * GET /api/analysis/history
 * Get user analysis history
 */
router.get(
  "/history",
  protect,
  asyncHandler(getUserAnalyses)
);

/**
 * GET /api/analysis/:id
 * Get single analysis
 */
router.get(
  "/:id",
  protect,
  asyncHandler(getSingleAnalysis)
);

/**
 * DELETE /api/analysis/:id
 * Admin only
 */
router.delete(
  "/:id",
  protect,
  authorize,
  asyncHandler(deleteAnalysis)
);

export default router;