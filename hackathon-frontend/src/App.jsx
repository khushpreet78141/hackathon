import "./chartSetup";
import Navbar from "./components/Navbar";
import InputSection from "./components/InputSection";
import RiskMeter from "./components/RiskMeter";
import RadarChart from "./components/RadarChart";
import HeatmapText from "./components/HeatmapText";
import TrendGraph from "./components/TrendGraph";

export default function App() {
  
  const mockAnalysis = {
    influence_intensity: 78,
    emotional_score: 8,
    fear_score: 7,
    bias_score: 6,
    authority_score: 4,
    polarization_score: 9,
    highlights: [
      { phrase: "collapse", intensity: 9 },
      { phrase: "foreign control", intensity: 6 }
    ],
    originalText:
      "Our country is on the brink of collapse! If we don't act now, we'll soon be under foreign control."
  };

  const mockTrend = [
    { date: "01", score: 40 },
    { date: "02", score: 65 },
    { date: "03", score: 78 },
    { date: "04", score: 52 }
  ];

  return (

    <div className="min-h-screen bg-slate-900 text-gray-200">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <InputSection />
        <div className="grid md:grid-cols-2 gap-6">
          <RiskMeter score={mockAnalysis.influence_intensity} />
          <RadarChart analysis={mockAnalysis} />
        </div>
        <HeatmapText analysis={mockAnalysis} />
        <TrendGraph trendData={mockTrend} />
      </div>
    </div>

  );

}
