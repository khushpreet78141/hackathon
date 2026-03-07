import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import {
    Clock, FileText, AlertTriangle, CheckCircle, Info,
    ShieldAlert, ChevronDown, ChevronUp, Search, Loader2, LogIn
} from "lucide-react";

export default function AnalysisLogPage() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null); // ID of expanded log
    const [filter, setFilter] = useState("all"); // all, low, moderate, high, extreme
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (authLoading) return;
        if (!user) return;

        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:3000/api/analysis/history", {
                    withCredentials: true,
                });
                if (res.data?.success) {
                    setLogs(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, authLoading]);

    const getRiskColor = (level) => {
        const l = (level || "").toLowerCase();
        if (l === "low") return "text-green-400";
        if (l === "moderate") return "text-yellow-400";
        if (l === "high") return "text-orange-400";
        if (l === "extreme") return "text-red-500";
        return "text-gray-400";
    };

    const getRiskBg = (level) => {
        const l = (level || "").toLowerCase();
        if (l === "low") return "border-green-500/20";
        if (l === "moderate") return "border-yellow-500/20";
        if (l === "high") return "border-orange-500/20";
        if (l === "extreme") return "border-red-500/20";
        return "border-slate-700/50";
    };

    const getRiskIcon = (level) => {
        const l = (level || "").toLowerCase();
        if (l === "low") return <CheckCircle className="w-4 h-4 text-green-400" />;
        if (l === "high" || l === "extreme") return <AlertTriangle className="w-4 h-4 text-red-400" />;
        return <Info className="w-4 h-4 text-yellow-400" />;
    };

    const getScoreColor = (score) => {
        if (score < 30) return "text-green-400";
        if (score < 50) return "text-yellow-400";
        if (score < 70) return "text-orange-400";
        return "text-red-500";
    };

    // Filter and search
    const filteredLogs = logs.filter((log) => {
        const matchesFilter = filter === "all" || log.riskLevel?.toLowerCase() === filter;
        const matchesSearch = searchTerm === "" ||
            log.originalText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.biasType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.propagandaTechniques?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    // Not logged in
    if (!authLoading && !user) {
        return (
            <div className="min-h-screen bg-slate-950 text-gray-200">
                <Navbar />
                <div className="max-w-3xl mx-auto p-6 text-center py-32">
                    <LogIn className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-400 mb-2">Login Required</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your analysis history.</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-8 py-3 bg-cyan-500 text-black rounded-xl font-bold hover:bg-cyan-400 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-gray-200">
            <Navbar />

            <div className="max-w-5xl mx-auto p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-cyan-400" />
                        <h1 className="text-2xl font-bold text-white">Analysis Log</h1>
                        <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full font-semibold">
                            {logs.length} total
                        </span>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-slate-900/70 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search analyses..."
                                className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 transition"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex gap-2">
                            {["all", "low", "moderate", "high", "extreme"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase transition-all
                    ${filter === f
                                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                            : "bg-slate-800/60 text-gray-500 border border-slate-700/50 hover:text-gray-300"}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-20">
                        <Loader2 className="w-8 h-8 text-cyan-400 mx-auto animate-spin mb-4" />
                        <p className="text-gray-500">Loading your analysis history...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredLogs.length === 0 && (
                    <div className="text-center py-20">
                        <ShieldAlert className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500">
                            {logs.length === 0 ? "No Analyses Yet" : "No Matching Results"}
                        </h3>
                        <p className="text-gray-600 mt-2 max-w-md mx-auto">
                            {logs.length === 0
                                ? "Head to the Dashboard and run your first analysis to see it here."
                                : "Try adjusting your search or filter."}
                        </p>
                        {logs.length === 0 && (
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="mt-6 px-8 py-3 bg-cyan-500 text-black rounded-xl font-bold hover:bg-cyan-400 transition"
                            >
                                Go to Dashboard
                            </button>
                        )}
                    </div>
                )}

                {/* Log Entries */}
                {!loading && filteredLogs.length > 0 && (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filteredLogs.map((log, index) => (
                                <motion.div
                                    key={log._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.03, 0.5) }}
                                    className={`bg-slate-900/70 backdrop-blur-md rounded-2xl border shadow-xl overflow-hidden transition-all ${getRiskBg(log.riskLevel)}`}
                                >
                                    {/* Row Header */}
                                    <button
                                        onClick={() => setExpanded(expanded === log._id ? null : log._id)}
                                        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-800/30 transition"
                                    >
                                        {/* Risk Icon */}
                                        <div className="shrink-0">
                                            {getRiskIcon(log.riskLevel)}
                                        </div>

                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-sm font-bold ${getRiskColor(log.riskLevel)}`}>
                                                    {log.riskLevel}
                                                </span>
                                                <span className="text-xs text-gray-600">•</span>
                                                <span className="text-xs text-gray-500 capitalize">{log.sentiment}</span>
                                                <span className="text-xs text-gray-600">•</span>
                                                <span className="text-xs text-gray-500">{log.biasType}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate max-w-lg">
                                                {log.originalText?.substring(0, 100)}...
                                            </p>
                                        </div>

                                        {/* Score + Date */}
                                        <div className="text-right shrink-0">
                                            <p className={`text-xl font-black ${getScoreColor(log.manipulationScore)}`}>
                                                {log.manipulationScore}%
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {new Date(log.createdAt).toLocaleDateString("en-US", {
                                                    month: "short", day: "numeric", year: "numeric"
                                                })}
                                            </p>
                                        </div>

                                        {/* Expand Arrow */}
                                        <div className="shrink-0 text-gray-600">
                                            {expanded === log._id
                                                ? <ChevronUp className="w-4 h-4" />
                                                : <ChevronDown className="w-4 h-4" />}
                                        </div>
                                    </button>

                                    {/* Expanded Detail */}
                                    <AnimatePresence>
                                        {expanded === log._id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border-t border-slate-800/50"
                                            >
                                                <div className="p-5 space-y-4">
                                                    {/* Stats Grid */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                                                            <p className="text-xs text-gray-500 uppercase font-semibold">Manipulation</p>
                                                            <p className={`text-lg font-bold ${getScoreColor(log.manipulationScore)}`}>
                                                                {log.manipulationScore}%
                                                            </p>
                                                        </div>
                                                        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                                                            <p className="text-xs text-gray-500 uppercase font-semibold">Emotional</p>
                                                            <p className={`text-lg font-bold ${getScoreColor(log.emotionalIntensity)}`}>
                                                                {log.emotionalIntensity}%
                                                            </p>
                                                        </div>
                                                        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                                                            <p className="text-xs text-gray-500 uppercase font-semibold">Sentiment</p>
                                                            <p className="text-lg font-bold capitalize text-purple-400">{log.sentiment}</p>
                                                        </div>
                                                        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                                                            <p className="text-xs text-gray-500 uppercase font-semibold">Risk</p>
                                                            <p className={`text-lg font-bold ${getRiskColor(log.riskLevel)}`}>{log.riskLevel}</p>
                                                        </div>
                                                    </div>

                                                    {/* Propaganda Techniques */}
                                                    {log.propagandaTechniques?.length > 0 && (
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Propaganda Techniques</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {log.propagandaTechniques.map((t, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium rounded-lg"
                                                                    >
                                                                        {t}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Original Text */}
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Analyzed Text</p>
                                                        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 max-h-40 overflow-y-auto">
                                                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                                {log.originalText}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Timestamp */}
                                                    <p className="text-xs text-gray-600">
                                                        Analyzed on {new Date(log.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
