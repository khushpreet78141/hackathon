import Trend from "../models/trend.js";
import Analysis from "../models/analysis.js";
import { getTrendData } from "../services/trendService.js";


/**
 * GET /api/trends
 * Return trend graph data
 */
export const getUserTrend = async (req, res) => {

  const trends = await getTrendData(req.user._id);

  res.status(200).json({
    success: true,
    data: trends
  });
};



/**
 * GET /api/trends/summary
 * Dashboard summary metrics
 */
export const getManipulationSummary = async (req, res) => {

  const totalAnalyses = await Analysis.countDocuments({
    userId: req.user._id
  });

  const avgScore = await Analysis.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: null,
        avgManipulation: { $avg: "$manipulationScore" }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalAnalyses,
      averageManipulationScore:
        avgScore.length > 0 ? avgScore[0].avgManipulation : 0
    }
  });
};



/**
 * GET /api/trends/risk-distribution
 * Radar / chart data
 */
export const getRiskDistribution = async (req, res) => {

  const distribution = await Analysis.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: "$riskLevel",
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    Low: 0,
    Moderate: 0,
    High: 0,
    Extreme: 0
  };

  distribution.forEach(item => {
    result[item._id] = item.count;
  });

  res.status(200).json({
    success: true,
    data: result
  });
};