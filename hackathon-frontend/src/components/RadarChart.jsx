import { Radar } from "react-chartjs-2";

export default function RadarChart({ analysis }) {
  if (!analysis) return null;

  // Map real API fields to radar chart dimensions
  const manipulationNorm = Math.round((analysis.manipulation_score || 0) / 10);
  const emotionalNorm = Math.round((analysis.emotional_intensity || 0) / 10);

  // Derive sub-scores from propaganda techniques count and bias
  const techniqueScore = Math.min((analysis.propaganda_techniques?.length || 0) * 2, 10);
  const biasScore = analysis.bias_type && analysis.bias_type !== "none" ? 7 : 2;
  const sentimentScore =
    analysis.sentiment === "negative" ? 8 :
      analysis.sentiment === "positive" ? 5 : 3;

  const data = {
    labels: ["Manipulation", "Emotional", "Propaganda", "Bias", "Sentiment"],
    datasets: [
      {
        label: "Influence Breakdown",
        data: [manipulationNorm, emotionalNorm, techniqueScore, biasScore, sentimentScore],
        backgroundColor: "rgba(6, 182, 212, 0.15)",
        borderColor: "rgba(6, 182, 212, 0.8)",
        pointBackgroundColor: "rgba(6, 182, 212, 1)",
        pointBorderColor: "#0f172a",
        pointBorderWidth: 2,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 10,
        grid: { color: "rgba(255,255,255,0.06)" },
        angleLines: { color: "rgba(255,255,255,0.06)" },
        ticks: { display: false },
        pointLabels: {
          color: "rgba(255,255,255,0.5)",
          font: { size: 11, weight: "600" },
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/20 shadow-xl">
      <h2 className="text-lg font-bold text-white mb-4">
        Influence Breakdown
      </h2>
      <Radar data={data} options={options} />
    </div>
  );
}