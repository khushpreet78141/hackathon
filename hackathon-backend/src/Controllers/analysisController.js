import {
  runAnalysis,
  fetchUserAnalyses,
  fetchSingleAnalysis,
  removeAnalysis
} from "../services/analysisService.js";

import { AppError } from "../middleware/errorHandler.js";


/**
 * POST /api/analysis
 * Run AI manipulation analysis
 */

export const analyzeText = async (req, res, next) => {
  const { text } = req.body;
  const userId = req.user ? req.user._id : null;

  if (!text || text.trim().length === 0) {
    return next(new AppError("Text input is required", 400));
  }

  if (text.length > 3000) {
    return next(new AppError("Text exceeds maximum length", 400));
  }

  const analysis = await runAnalysis(userId, text);

  res.status(201).json({
    success: true,
    data: analysis
  });
};


/**
 * GET /api/analysis/history
 * Fetch user analysis history
 */
export const getUserAnalyses = async (req, res) => {

  const analyses = await fetchUserAnalyses(req.user._id);

  res.status(200).json({
    success: true,
    count: analyses.length,
    data: analyses
  });
};


/**
 * GET /api/analysis/:id
 * Get single analysis
 */
export const getSingleAnalysis = async (req, res, next) => {

  const analysis = await fetchSingleAnalysis(
    req.params.id,
    req.user._id
  );

  if (!analysis) {
    return next(new AppError("Analysis not found", 404));
  }

  res.status(200).json({
    success: true,
    data: analysis
  });
};


/**
 * DELETE /api/analysis/:id
 * Admin delete analysis
 */
export const deleteAnalysis = async (req, res, next) => {

  const analysis = await removeAnalysis(req.params.id);

  if (!analysis) {
    return next(new AppError("Analysis not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Analysis deleted"
  });
};