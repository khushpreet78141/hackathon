import { useState, useRef } from "react";
import axios from "axios";
import { Image as ImageIcon, Upload, X, Search, FileText, ArrowRight } from "lucide-react";

export default function InputSection({ onAnalysisResult }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!text.trim() && !file) return;

    try {
      setLoading(true);
      let res;

      if (file) {
        // multipart/form-data for image analysis
        const formData = new FormData();
        formData.append("image", file);
        if (text.trim()) {
          formData.append("text", text);
        }

        res = await axios.post("http://localhost:3000/api/image-analysis", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      } else {
        // JSON for text analysis
        res = await axios.post(
          "http://localhost:3000/api/analysis",
          { text },
          { withCredentials: true }
        );
      }

      const data = res.data;
      console.log("Analysis Result:", data);

      // Pass result up to the dashboard
      if (onAnalysisResult) {
        onAnalysisResult(data);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      alert(error.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/20 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Search className="text-cyan-400 w-5 h-5" />
        <h2 className="text-xl font-bold text-white tracking-tight">
          Analyze Digital Content
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Text Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
              <FileText className="w-3 h-3" /> Text Content
            </span>
            <span className="text-xs text-gray-500">
              {text.length}/3000
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-colors resize-none"
            placeholder="Paste suspicious text, article link, or social media post here..."
          />
        </div>

        {/* Image Input */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 px-1">
            <ImageIcon className="w-3 h-3" /> Image / Screenshot
          </span>

          {!preview ? (
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full h-40 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 hover:border-cyan-500/50 transition-all flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="p-3 bg-slate-800 rounded-full mb-3 group-hover:bg-cyan-500/10 transition-colors">
                <Upload className="text-gray-500 group-hover:text-cyan-400 w-6 h-6" />
              </div>
              <p className="text-sm text-gray-400 font-medium">Click to upload or drag image</p>
              <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 5MB</p>
            </div>
          ) : (
            <div className="w-full h-40 relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700/50">
              <img
                src={preview}
                alt="Upload Preview"
                className="w-full h-full object-contain"
              />
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 p-1.5 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg backdrop-blur-md transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            Gemini AI Active
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
            Shadow Scanner Ready
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || (!text.trim() && !file)}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold shadow-2xl transition-all active:scale-95
          ${loading || (!text.trim() && !file)
              ? "bg-slate-700 text-gray-500 cursor-not-allowed"
              : "bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-cyan-500/25"}`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Run Deep Analysis
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
