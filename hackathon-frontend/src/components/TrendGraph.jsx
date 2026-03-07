import { Line } from "react-chartjs-2";

export default function TrendGraph({ trendData }) {
  const data = {
    labels: trendData.map(item => item.date),
    datasets: [
      {
        label: "Influence Intensity",
        data: trendData.map(item => item.score),
        borderColor: "#dc2626",
        tension: 0.4
      }
    ]
  };

  const options = {
    plugins: { legend: { display: false } }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">
        Influence Trend Over Time
      </h2>
      <Line data={data} options={options} />
    </div>
  );
}