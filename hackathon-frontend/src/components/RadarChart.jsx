import { Radar } from "react-chartjs-2";

export default function RadarChart({ analysis }) {
  const data = {
    labels: ["Emotional", "Fear", "Bias", "Authority", "Polarization"],
    datasets: [
      {
        label: "Influence Breakdown",
        data: [
          analysis.emotional_score,
          analysis.fear_score,
          analysis.bias_score,
          analysis.authority_score,
          analysis.polarization_score
        ],
        backgroundColor: "rgba(220,38,38,0.2)",
        borderColor: "rgba(220,38,38,1)",
        borderWidth: 2
      }
    ]
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 10,
        grid: { color: "rgba(255,255,255,0.1)" },
        angleLines: { color: "rgba(255,255,255,0.1)" },
        ticks: { display: false }
      }
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">
        Influence Breakdown
      </h2>
      <Radar data={data} options={options} />
    </div>
  );
}