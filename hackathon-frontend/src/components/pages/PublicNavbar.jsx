import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="w-full bg-slate-950 border-b border-cyan-500/20 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="relative w-9 h-9 flex items-center justify-center border border-cyan-400 rounded-md shadow-lg shadow-cyan-500/30">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
          </div>
          <h1 className="text-cyan-400 font-bold tracking-widest">
            ShadowInfluence
          </h1>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8 text-gray-300">
          <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
          <Link to="/about" className="hover:text-cyan-400 transition">About</Link>
          <Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link>

          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link>
              <Link to="/profile" className="hover:text-cyan-400 transition">Profile</Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-semibold transition-all"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
              className="px-5 py-2 bg-cyan-500 text-black rounded-lg font-semibold shadow-lg shadow-cyan-500/30"
            >
              Get Started
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}