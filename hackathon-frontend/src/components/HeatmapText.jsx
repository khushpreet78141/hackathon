export default function HeatmapText({ analysis }) {

  if (!analysis) {
    return (
      <div className="bg-slate-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">
          Manipulative Text Highlight
        </h2>
        <p className="text-gray-400">Run an analysis to see highlighted text.</p>
      </div>
    );
  }

  const getColor = (intensity) => {
    if (intensity < 4) return "bg-yellow-400/20";
    if (intensity < 7) return "bg-orange-500/30";
    return "bg-red-600/40";
  };

  let text = analysis.originalText || "";

  analysis.highlights?.forEach((item) => {
    const regex = new RegExp(`(${item.phrase})`, "gi");

    text = text.replace(
      regex,
      `<span class="${getColor(item.intensity)} font-semibold">$1</span>`
    );
  });

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">
        Manipulative Text Highlight
      </h2>

      <div
        className="leading-relaxed text-gray-300"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}