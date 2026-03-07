import { ShieldAlert } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full flex flex-row bg-slate-950 border-b border-red-900/40 backdrop-blur-md">
      <div className="w-full container mx-auto px-4 py-4 flex flex-row items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-500 w-6 h-6" />
          <h1 className="text-xl font-bold tracking-wider text-white">
            <span className="text-red-500">Shadow</span>Influence
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-sm uppercase tracking-wide">
          <button className="text-gray-400 hover:text-red-400 transition duration-200">
            Dashboard
          </button>
          <button className="text-gray-400 hover:text-red-400 transition duration-200">
            Analysis Log
          </button>
          <button className="text-gray-400 hover:text-red-400 transition duration-200">
            Profile
          </button>

          {/* System Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-xs">System Active</span>
          </div>
        </div>
      </div>
    </nav>
  );
}