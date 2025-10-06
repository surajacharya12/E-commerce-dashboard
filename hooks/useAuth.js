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
  }, []);

  const checkAuth = () => {
    try {
      // Always clear any existing session data on page load
      localStorage.removeItem("dashboardAuth");
      localStorage.removeItem("dashboardUser");
      localStorage.removeItem("dashboardLoginTime");

      // Always start as unauthenticated - require fresh login every time
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = (username) => {
    // Set authentication state only in memory (no localStorage persistence)
    setIsAuthenticated(true);
    setUser(username);
    console.log("✅ User logged in:", username, "- Session will not persist");
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
