import { motion } from "framer-motion";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
=======
import { Link, useNavigate } from "react-router-dom";

>>>>>>> ccc8a2cd6c623b116cace9916a0c7aea335f00cb
export default function PublicNavbar() {

  const navigate = useNavigate();

  return (
    <nav className="w-full bg-slate-950 border-b border-cyan-500/20 backdrop-blur-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">

          <div className="relative w-9 h-9 flex items-center justify-center border border-cyan-400 rounded-md shadow-lg shadow-cyan-500/30">

            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />

          </div>

          <h1 className="text-cyan-400 font-bold tracking-widest">
            ShadowInfluence
          </h1>

        </div>


        {/* Links */}
        <div className="flex items-center gap-8 text-gray-300">

          <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
          <Link to="/about" className="hover:text-cyan-400 transition">About</Link>
          <Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link>
          <Link to="/profile" className="hover:text-cyan-400 transition">Profile</Link>

          {/*<a href="#" className=>
            About
          </a>

          <a href="#" className=>
            Contact
          </a>*/}


          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth")}
            className="px-5 py-2 bg-cyan-500 text-black rounded-lg font-semibold shadow-lg shadow-cyan-500/30"
          >
            Get Started
          </motion.button>

        </div>

      </div>

    </nav>
  );
}