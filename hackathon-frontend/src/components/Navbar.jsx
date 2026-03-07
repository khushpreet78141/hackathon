import { ShieldAlert, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const accent = theme === "cyan" ? "text-cyan-500" : "text-red-500";
  const accentHover = theme === "cyan" ? "hover:text-cyan-400" : "hover:text-red-400";
  const borderColor = theme === "cyan" ? "border-cyan-500/20" : "border-red-500/20";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className={`w-full flex flex-row bg-slate-950 border-b ${borderColor} backdrop-blur-md`}>
      <div className="w-full container mx-auto px-4 py-4 flex flex-row items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <ShieldAlert className={`${accent} w-6 h-6`} />
          <h1 className="text-xl font-bold tracking-wider text-white">
            <span className={accent}>Shadow</span>Influence
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm uppercase tracking-wide">
          <Link to="/dashboard" className={`text-gray-400 ${accentHover} transition duration-200`}>
            Dashboard
          </Link>
          <Link to="/analysis-log" className={`text-gray-400 ${accentHover} transition duration-200`}>
            Analysis Log
          </Link>
          <Link to="/profile" className={`text-gray-400 ${accentHover} transition duration-200`}>
            Profile
          </Link>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2 text-gray-400">
              <User className="w-4 h-4" />
              <span className="text-xs normal-case">{user.name || user.email}</span>
            </div>
          )}

          {/* System Status */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-xs">Active</span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}