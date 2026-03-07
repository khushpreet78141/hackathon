import { useState } from "react";

export default function InputSection() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      console.log(data);

    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">
        Analyze Digital Content
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-32 bg-slate-900 border border-gray-600 rounded-lg p-4 text-gray-300 focus:outline-none focus:border-red-500"
        placeholder="Paste article, speech, or post here..."
      />

      {/* Character Counter */}
      <p className="text-sm text-gray-400 mt-1">
        {text.length}/3000 characters
      </p>

      <button
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        className={`mt-4 px-6 py-3 rounded-lg shadow-lg transition 
        ${loading || !text.trim()
          ? "bg-gray-600 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700"}`}
      >
        {loading ? "Analyzing..." : "Analyze Influence"}
      </button>
    </div>
  );
}



