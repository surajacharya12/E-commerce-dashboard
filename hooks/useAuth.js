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
      // Check for existing authentication state
      const isAuth = localStorage.getItem("dashboardAuth");
      const storedUser = localStorage.getItem("dashboardUser");
      const loginTime = localStorage.getItem("dashboardLoginTime");

      // Check if session is still valid (24 hours)
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      const currentTime = new Date().getTime();

      if (isAuth === "true" && storedUser && loginTime) {
        const timeDiff = currentTime - parseInt(loginTime);

        if (timeDiff < sessionDuration) {
          // Session is still valid
          setIsAuthenticated(true);
          setUser(storedUser);
          console.log("✅ Valid session found, user logged in");
        } else {
          // Session expired
          localStorage.removeItem("dashboardAuth");
          localStorage.removeItem("dashboardUser");
          localStorage.removeItem("dashboardLoginTime");
          setIsAuthenticated(false);
          setUser(null);
          console.log("⏰ Session expired, please login again");
        }
      } else {
        // No valid session found
        setIsAuthenticated(false);
        setUser(null);
        console.log("🔒 No valid session found");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (username) => {
    // Set authentication state and persist in localStorage
    const currentTime = new Date().getTime();

    localStorage.setItem("dashboardAuth", "true");
    localStorage.setItem("dashboardUser", username);
    localStorage.setItem("dashboardLoginTime", currentTime.toString());

    setIsAuthenticated(true);
    setUser(username);

    console.log(
      "✅ User logged in:",
      username,
      "- Session will persist for 24 hours"
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
