import { AlertTriangle, Shield } from "lucide-react";

export default function HeatmapText({ analysis }) {
  if (!analysis) {
    return (
      <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/20 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4">
          Detected Techniques
        </h2>
        <p className="text-gray-500">Run an analysis to see detected propaganda techniques.</p>
      </div>
    );
  }

  const techniques = analysis.propaganda_techniques || [];

  return (
    <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/20 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-bold text-white">
          Detected Propaganda Techniques
        </h2>
      </div>

      {techniques.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-6">
          {techniques.map((technique, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium rounded-lg"
            >
              {technique}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-6 text-green-400">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">No propaganda techniques detected</span>
        </div>
      )}

      {/* Original / Extracted Text */}
      {analysis.originalText && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Analyzed Text
          </h3>
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 max-h-48 overflow-y-auto">
            <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
              {analysis.originalText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}