import express from "express";
import {
  getUserTrend,
  getManipulationSummary,
  getRiskDistribution
} from "../controllers/trendController.js";

import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

/**
 * GET /api/trends
 * Get daily manipulation trend data
 */
router.get(
  "/",
  protect,
  asyncHandler(getUserTrend)
);

/**
 * GET /api/trends/summary
 * Dashboard summary metrics
 */
router.get(
  "/summary",
  protect,
  asyncHandler(getManipulationSummary)
);

/**
 * GET /api/trends/risk-distribution
 * Radar / pie chart data
 */
router.get(
  "/risk-distribution",
  protect,
  asyncHandler(getRiskDistribution)
);

export default router;