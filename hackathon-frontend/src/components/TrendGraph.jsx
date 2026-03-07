import { Line } from "react-chartjs-2";

export default function TrendGraph({ trendData }) {
  if (!trendData || trendData.length < 2) return null;

  const data = {
    labels: trendData.map((item) => item.date),
    datasets: [
      {
        label: "Manipulation Score",
        data: trendData.map((item) => item.score),
        borderColor: "rgba(6, 182, 212, 0.8)",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(6, 182, 212, 1)",
        pointBorderColor: "#0f172a",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "rgba(255,255,255,0.3)", font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "rgba(255,255,255,0.3)", font: { size: 11 } },
      },
    },
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/20 shadow-xl">
      <h2 className="text-lg font-bold text-white mb-4">
        Analysis Trend (This Session)
      </h2>
      <Line data={data} options={options} />
    </div>
  );
}