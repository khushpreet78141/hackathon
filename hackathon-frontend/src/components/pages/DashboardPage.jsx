import { useState } from "react";
import "../../chartSetup";
import Navbar from "../Navbar";
import InputSection from "../InputSection";
import RiskMeter from "../RiskMeter";
import RadarChart from "../RadarChart";
import HeatmapText from "../HeatmapText";
import TrendGraph from "../TrendGraph";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, FileText, AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [trendData, setTrendData] = useState([]);

  const handleAnalysisResult = (result) => {
    console.log("Dashboard received:", result);

    // Normalize: the API may return { data: { extractedText, ...aiResult } }  
    // or { data: { extractedText, analysis: { ... } } }
    const raw = result.data || result;
    const ai = raw.analysis || raw;

    const normalized = {
      manipulation_score: ai.manipulation_score ?? ai.manipulationScore ?? 0,
      emotional_intensity: ai.emotional_intensity ?? ai.emotionalIntensity ?? 0,
      bias_type: ai.bias_type ?? ai.biasType ?? "none",
      propaganda_techniques: ai.propaganda_techniques ?? ai.propagandaTechniques ?? [],
      sentiment: ai.sentiment ?? "neutral",
      risk_level: ai.risk_level ?? ai.riskLevel ?? "Low",
      explanation: ai.explanation ?? "",
      originalText: raw.extractedText || ai.originalText || "",
    };

    setAnalysis(normalized);

    // Append to trend data
    setTrendData((prev) => {
      const next = [
        ...prev,
        {
          date: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          score: normalized.manipulation_score,
        },
      ];
      return next.slice(-10); // Keep last 10 entries
    });
  };

  const getRiskColor = (level) => {
    const l = (level || "").toLowerCase();
    if (l === "low") return "text-green-400";
    if (l === "moderate") return "text-yellow-400";
    if (l === "high") return "text-orange-400";
    if (l === "extreme") return "text-red-500";
    return "text-gray-400";
  };

  const getRiskIcon = (level) => {
    const l = (level || "").toLowerCase();
    if (l === "low") return <CheckCircle className="w-5 h-5" />;
    if (l === "extreme" || l === "high") return <AlertTriangle className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <InputSection onAnalysisResult={handleAnalysisResult} />

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Summary Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/70 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">Analysis Summary</h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Risk Level */}
                  <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Risk Level</p>
                    <p className={`text-2xl font-bold flex items-center gap-2 ${getRiskColor(analysis.risk_level)}`}>
                      {getRiskIcon(analysis.risk_level)}
                      {analysis.risk_level}
                    </p>
                  </div>

                  {/* Manipulation Score */}
                  <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Manipulation Score</p>
                    <p className="text-2xl font-bold text-cyan-400">{analysis.manipulation_score}%</p>
                  </div>

                  {/* Sentiment */}
                  <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Sentiment</p>
                    <p className="text-2xl font-bold capitalize text-purple-400">{analysis.sentiment}</p>
                  </div>

                  {/* Bias Type */}
                  <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Bias Type</p>
                    <p className="text-lg font-bold text-amber-400 capitalize">{analysis.bias_type}</p>
                  </div>
                </div>
              </motion.div>

              {/* Charts Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <RiskMeter score={analysis.manipulation_score} />
                <RadarChart analysis={analysis} />
              </div>

              {/* Explanation */}
              {analysis.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-900/70 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-lg font-bold text-white">AI Explanation</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{analysis.explanation}</p>
                </motion.div>
              )}

              {/* Heatmap / Propaganda */}
              <HeatmapText analysis={analysis} />

              {/* Trend Graph */}
              {trendData.length > 1 && <TrendGraph trendData={trendData} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShieldAlert className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500">No Analysis Yet</h3>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">
              Paste text or upload a screenshot above and click "Run Deep Analysis" to scan for manipulation, propaganda, and emotional influence.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}