import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import axios from "axios";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Password change state
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
        otp: ""
    });
    const [otpSent, setOtpSent] = useState(false);
    const [status, setStatus] = useState("");
    const [isChangingPass, setIsChangingPass] = useState(false);

    useEffect(() => {
        // Fetch current user details
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/auth/getMe", {
                    withCredentials: true
                });
                setUser(res.data.user);
            } catch (error) {
                console.error("Not authenticated", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const sendOtp = async () => {
        if (!passwords.newPassword || passwords.newPassword !== passwords.confirmPassword) {
            setStatus("Please enter and confirm your new password first.");
            return;
        }
        if (passwords.newPassword.length < 6) {
            setStatus("Password must be at least 6 characters.");
            return;
        }
        setStatus("Sending OTP...");
        try {
            await axios.post("http://localhost:3000/api/auth/otp", { email: user.email });
            setOtpSent(true);
            setStatus("OTP sent to your email!");
        } catch (error) {
            console.error(error);
            setStatus("Failed to send OTP.");
        }
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        if (!otpSent) return;

        setIsChangingPass(true);
        setStatus("Updating...");

        try {
            await axios.post(
                "http://localhost:3000/api/auth/change-password",
                {
                    newPassword: passwords.newPassword,
                    otp: passwords.otp
                },
                { withCredentials: true }
            );
            setStatus("Password updated successfully!");
            setPasswords({ newPassword: "", confirmPassword: "", otp: "" });
            setOtpSent(false);
        } catch (error) {
            console.error(error);
            setStatus(error.response?.data?.message || "Failed to update password.");
        } finally {
            setIsChangingPass(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-gray-200">
            <PublicNavbar />

            <div className="max-w-4xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-cyan-400">My Profile</h1>
                        <p className="text-gray-400 mt-2">Manage your account settings and security.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition"
                    >
                        Logout
                    </button>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* User Details Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 border border-cyan-500/20 p-8 rounded-xl"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
                            Account Information
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">Full Name</label>
                                <div className="text-lg font-medium">{user?.name}</div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500 block mb-1">Email Address</label>
                                <div className="text-lg font-medium">{user?.email}</div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500 block mb-1">Account Role</label>
                                <div className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-sm">
                                    {user?.role || "user"}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500 block mb-1">Total Analyses</label>
                                <div className="text-xl font-bold text-cyan-400">{user?.totalAnalyses || 0}</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Change Password Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900 border border-cyan-500/20 p-8 rounded-xl"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
                            Security
                        </h2>

                        <form onSubmit={submitPasswordChange} className="space-y-5">
                            {!otpSent ? (
                                <>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwords.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength="6"
                                            className="w-full p-2.5 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwords.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength="6"
                                            className="w-full p-2.5 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400 text-sm"
                                        />
                                    </div>

                                    {status && (
                                        <p className={`text-sm ${status.includes("sent") || status.includes("successfully") ? "text-green-400" : "text-red-400"}`}>
                                            {status}
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        onClick={sendOtp}
                                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-lg font-medium transition"
                                    >
                                        Send OTP to Email
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Enter OTP</label>
                                        <input
                                            type="text"
                                            name="otp"
                                            value={passwords.otp}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full p-2.5 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400 text-center tracking-widest text-lg"
                                            placeholder="• • • • • •"
                                        />
                                    </div>

                                    {status && (
                                        <p className={`text-sm ${status.includes("successfully") ? "text-green-400" : "text-red-400"}`}>
                                            {status}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isChangingPass}
                                        className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg font-bold transition disabled:opacity-50"
                                    >
                                        {isChangingPass ? "Updating..." : "Verify & Update Password"}
                                    </button>
                                </>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
