import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const LoginUser = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:3000/api/auth/login",
                {
                    email: e.target.email.value,
                    password: e.target.password.value,
                },
                { withCredentials: true }
            );
            setSuccess("Login successful! Redirecting...");
            console.log(res.data);
            setTimeout(() => navigate("/dashboard"), 1200);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated background blobs */}
            <motion.div
                className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]"
                animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px]"
                animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, -30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Glass card */}
                <div className="bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl shadow-cyan-500/5">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-4"
                        >
                            <ShieldCheck className="w-7 h-7 text-cyan-400" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h2>
                        <p className="text-gray-500 text-sm mt-1">Sign in to ShadowInfluence</p>
                    </div>

                    {/* Error / Success Messages */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
                        >
                            {success}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={LoginUser} className="space-y-5">
                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Email address"
                                className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                placeholder="Password"
                                className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-gray-500 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-lg shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-slate-700/50" />
                        <span className="text-gray-600 text-xs uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-slate-700/50" />
                    </div>

                    {/* Register link */}
                    <p className="text-center text-gray-500 text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-cyan-400 hover:text-cyan-300 font-medium transition"
                        >
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Bottom glow line */}
                <div className="mt-6 flex justify-center">
                    <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-full" />
                </div>
            </motion.div>
        </div>
    );
}
