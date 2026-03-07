// /models/Analysis.js

import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    originalText: {
      type: String,
      required: true,
      maxlength: 3000
    },

    manipulationScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true
    },

    emotionalIntensity: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    biasType: {
      type: String,
      required: true
    },

    propagandaTechniques: [
      {
        type: String
      }
    ],

    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"]
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Moderate", "High", "Extreme"],
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

/*
  Indexes for performance:
  - Fast user history fetch
  - Fast risk-level filtering
  - Trend aggregation
*/

analysisSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Analysis", analysisSchema);