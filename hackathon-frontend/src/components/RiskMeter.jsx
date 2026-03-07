import { Doughnut } from "react-chartjs-2";

export default function RiskMeter({ score }) {
  if (score === null || score === undefined) return null;

  const getColor = (s) => {
    if (s < 30) return "#22c55e"; // green
    if (s < 50) return "#eab308"; // yellow
    if (s < 70) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  const getLabel = (s) => {
    if (s < 30) return "Low Risk";
    if (s < 50) return "Moderate";
    if (s < 70) return "High Risk";
    return "Critical";
  };

  const color = getColor(score);

  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [color, "rgba(30, 41, 59, 0.5)"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "78%",
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/20 shadow-xl">
      <h2 className="text-lg font-bold text-white mb-4">
        Manipulation Score
      </h2>
      <div className="relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6">
          <p className="text-4xl font-black" style={{ color }}>
            {score}%
          </p>
          <p className="text-sm font-semibold text-gray-400 mt-1">
            {getLabel(score)}
          </p>
        </div>
      </div>
    </div>
  );
}