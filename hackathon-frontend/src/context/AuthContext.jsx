import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount (page refresh)
    useEffect(() => {
        const checkAuth = async () => {
            console.log("Checking auth status...");
            try {
                const res = await axios.get("http://localhost:3000/api/auth/getMe", {
                    withCredentials: true,
                });
                console.log("Auth response:", res.data);
                if (res.data?.success && res.data?.user) {
                    setUser(res.data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth check failed:", err.response?.data || err.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (userData) => {
        console.log("Logging in user:", userData);
        setUser(userData);
    };

    const logout = async () => {
        console.log("Logging out...");
        try {
            await axios.post("http://localhost:3000/api/auth/logout", {}, {
                withCredentials: true,
            });
        } catch (err) {
            console.error("Logout error:", err);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading ? children : (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
