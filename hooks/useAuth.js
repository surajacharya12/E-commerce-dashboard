"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();

    // Clear session on page unload/refresh
    const handleBeforeUnload = () => {
      localStorage.removeItem("dashboardAuth");
      localStorage.removeItem("dashboardUser");
      localStorage.removeItem("dashboardLoginTime");
    };

    // Clear session on visibility change (tab switch, minimize, etc.)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        localStorage.removeItem("dashboardAuth");
        localStorage.removeItem("dashboardUser");
        localStorage.removeItem("dashboardLoginTime");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const checkAuth = () => {
    try {
      // Always require fresh login - no session persistence
      // Clear any existing localStorage data on page load
      localStorage.removeItem("dashboardAuth");
      localStorage.removeItem("dashboardUser");
      localStorage.removeItem("dashboardLoginTime");

      setIsAuthenticated(false);
      setUser(null);
      console.log("🔒 Fresh login required - no session persistence");
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (username) => {
    // Set authentication state in memory only (no localStorage persistence)
    setIsAuthenticated(true);
    setUser(username);

    console.log(
      "✅ User logged in:",
      username,
      "- Session will not persist across page refreshes"
    );
  };

  const logout = () => {
    // Clear authentication state
    setIsAuthenticated(false);
    setUser(null);
    // Clear any residual localStorage data
    localStorage.removeItem("dashboardAuth");
    localStorage.removeItem("dashboardUser");
    localStorage.removeItem("dashboardLoginTime");
    router.push("/login");
  };

  // Redirect logic
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      } else if (isAuthenticated && pathname === "/login") {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
