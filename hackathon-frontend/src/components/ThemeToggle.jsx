import { useTheme } from "../context/ThemeContext";
import { Palette } from "lucide-react";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer group"
            style={{
                borderColor: theme === "cyan" ? "rgba(6,182,212,0.3)" : "rgba(239,68,68,0.3)",
                backgroundColor: theme === "cyan" ? "rgba(6,182,212,0.08)" : "rgba(239,68,68,0.08)",
            }}
            title={`Switch to ${theme === "cyan" ? "Red" : "Cyan"} theme`}
        >
            {/* Track */}
            <div
                className="relative w-10 h-5 rounded-full transition-all duration-300"
                style={{
                    backgroundColor: theme === "cyan" ? "rgba(6,182,212,0.2)" : "rgba(239,68,68,0.2)",
                }}
            >
                {/* Thumb */}
                <div
                    className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 shadow-md"
                    style={{
                        left: theme === "cyan" ? "2px" : "calc(100% - 18px)",
                        backgroundColor: theme === "cyan" ? "#06b6d4" : "#ef4444",
                        boxShadow: theme === "cyan"
                            ? "0 0 8px rgba(6,182,212,0.5)"
                            : "0 0 8px rgba(239,68,68,0.5)",
                    }}
                />
            </div>

            {/* Label */}
            <span
                className="text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
                style={{ color: theme === "cyan" ? "#22d3ee" : "#f87171" }}
            >
                {theme === "cyan" ? "Cyan" : "Red"}
            </span>
        </button>
    );
}
