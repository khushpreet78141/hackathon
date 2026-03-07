// /models/Trend.js

import mongoose from "mongoose";

const trendSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    date: {
      type: Date,
      required: true,
      index: true
    },

    averageManipulationScore: {
      type: Number,
      default: 0
    },

    averageEmotionalIntensity: {
      type: Number,
      default: 0
    },

    totalAnalyses: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Ensure one trend per user per day
trendSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Trend", trendSchema);

