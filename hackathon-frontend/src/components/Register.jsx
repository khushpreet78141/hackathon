import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    ShieldAlert,
    User,
    Mail,
    Lock,
    KeyRound,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    Send,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [email, setEmail] = useState("");

    const sendOtp = async () => {
        if (!email) {
            setError("Please enter your email first.");
            return;
        }
        setError("");
        setOtpLoading(true);

        try {
            const res = await axios.post("http://localhost:3000/api/auth/otp", {
                email,
            });
            console.log(res.data);
            setOtpSent(true);
            setSuccess("OTP sent to your email!");
            setTimeout(() => setSuccess(""), 4000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP.");
            console.log(err);
        } finally {
            setOtpLoading(false);
        }
    };

    const RegisterUser = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:3000/api/auth/register",
                {
                    name: e.target.name.value,
                    email: e.target.email.value,
                    password: e.target.password.value,
                    otp: e.target.otp.value,
                },
                { withCredentials: true }
            );
            setSuccess("Account created! Redirecting...");
            console.log(res.data);
            setTimeout(() => navigate("/dashboard"), 1200);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated background blobs */}
            <motion.div
                className="absolute top-[-80px] right-[-80px] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px]"
                animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[-120px] left-[-80px] w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[110px]"
                animate={{ scale: [1, 1.3, 1], y: [0, -40, 0] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Register Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl shadow-cyan-500/5">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-4"
                        >
                            <ShieldAlert className="w-7 h-7 text-cyan-400" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white tracking-wide">
                            Create Account
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Join ShadowInfluence
                        </p>
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
                    <form onSubmit={RegisterUser} className="space-y-4">
                        {/* Name */}
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Full name"
                                className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* OTP row */}
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    name="otp"
                                    required
                                    placeholder="Enter OTP"
                                    maxLength={6}
                                    className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition tracking-widest"
                                />
                            </div>
                            <motion.button
                                type="button"
                                onClick={sendOtp}
                                disabled={otpLoading}
                                whileHover={{ scale: otpLoading ? 1 : 1.04 }}
                                whileTap={{ scale: otpLoading ? 1 : 0.96 }}
                                className={`px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all cursor-pointer ${otpSent
                                        ? "bg-green-500/15 border border-green-500/30 text-green-400"
                                        : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {otpLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                {otpSent ? "Resend" : "Get OTP"}
                            </motion.button>
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
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-slate-700/50" />
                        <span className="text-gray-600 text-xs uppercase tracking-wider">
                            or
                        </span>
                        <div className="flex-1 h-px bg-slate-700/50" />
                    </div>

                    {/* Login link */}
                    <p className="text-center text-gray-500 text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-cyan-400 hover:text-cyan-300 font-medium transition"
                        >
                            Sign in
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