import { Doughnut } from "react-chartjs-2";

export default function RiskMeter({ score }) {
  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [
          score < 30 ? "#16a34a"
            : score < 70 ? "#f59e0b"
            : "#dc2626",
          "#1f2937"
        ],
        borderWidth: 0
      }
    ]
  };

  const options = {
    cutout: "75%",
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">
        Influence Score
      </h2>
      <Doughnut data={data} options={options} />
      <p className="text-center text-3xl font-bold mt-4 text-red-500">
        {score}%
      </p>
    </div>
  );
}