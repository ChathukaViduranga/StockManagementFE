"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// build the theme *inside* the client boundary
const theme = createTheme({
  palette: {
    primary: { main: "#0ea5e9" },
    background: { default: "#f0f8ff" },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: { borderRadius: 12 },
        columnHeaders: { backgroundColor: "#cfe8ff" },
      },
    },
  },
});

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // 'admin' | 'worker' | null
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const loggedIn = localStorage.getItem("isAuthenticated") === "true";
        const storedRole = localStorage.getItem("role");
        setIsAuthenticated(loggedIn);
        setRole(storedRole);
        setIsLoading(false);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const login = (userRole) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("role", userRole);
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
    router.push("/login");
  };

  // Don't render children until initial auth check is complete
  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function Providers({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
