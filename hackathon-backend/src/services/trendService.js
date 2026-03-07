import Trend from "../models/trend.js";

export const updateTrend = async (
  userId,
  manipulationScore,
  emotionalIntensity
) => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let trend = await Trend.findOne({
    userId,
    date: today
  });

  if (!trend) {
    trend = await Trend.create({
      userId,
      date: today,
      averageManipulationScore: manipulationScore,
      averageEmotionalIntensity: emotionalIntensity,
      totalAnalyses: 1
    });

    return trend;
  }

  const newTotal = trend.totalAnalyses + 1;

  trend.averageManipulationScore =
    (trend.averageManipulationScore * trend.totalAnalyses +
      manipulationScore) /
    newTotal;

  trend.averageEmotionalIntensity =
    (trend.averageEmotionalIntensity * trend.totalAnalyses +
      emotionalIntensity) /
    newTotal;

  trend.totalAnalyses = newTotal;

  await trend.save();

  return trend;
};



export const getTrendData = async (userId) => {

  const trends = await Trend.find({ userId })
    .sort({ date: 1 })
    .select("date averageManipulationScore");


    
  return trends.map((t) => ({
    date: t.date,
    score: t.averageManipulationScore
  }));
};