// src/services/analysisService.js
import Analysis from "../models/analysis.js";
import User from "../models/user.js";
import { analyzeWithAI } from "./aiService.js";
import { updateTrend } from "./trendService.js";
import mongoose from "mongoose";

export const runAnalysis = async (userId, text) => {
  const aiResult = await analyzeWithAI(text);
  console.log("AI result:", aiResult);

  // Ensure userId is valid ObjectId
  const validUserId = mongoose.Types.ObjectId.isValid(userId)
    ? userId
    : new mongoose.Types.ObjectId("64f1c0b7d123456789abcdef"); // temp fallback

  const analysis = await Analysis.create({
    userId: validUserId,
    originalText: text,
    manipulationScore: aiResult.manipulation_score,
    emotionalIntensity: aiResult.emotional_intensity,
    biasType: aiResult.bias_type,
    propagandaTechniques: aiResult.propaganda_techniques,
    sentiment: aiResult.sentiment,
    riskLevel: aiResult.risk_level
  });

  // Update user stats
  await User.findByIdAndUpdate(validUserId, { $inc: { totalAnalyses: 1 } });

  // Update daily trend
  await updateTrend(validUserId, aiResult.manipulation_score, aiResult.emotional_intensity);

  return analysis;
};

export const fetchUserAnalyses = async (userId) => {
  return Analysis.find({ userId }).sort({ createdAt: -1 }).limit(20);
};

export const fetchSingleAnalysis = async (analysisId, userId) => {
  return Analysis.findOne({ _id: analysisId, userId });
};

export const removeAnalysis = async (analysisId) => {
  return Analysis.findByIdAndDelete(analysisId);
};