"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage or API on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("optomelektro_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Local auth parse error:", e);
    }

    // Verify with /api/auth/me
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("optomelektro_user", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("optomelektro_user");
        }
      })
      .catch((err) => {
        console.error("Auth check error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (phone, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Kirishda xatolik yuz berdi");
    }
    setUser(data.user);
    localStorage.setItem("optomelektro_user", JSON.stringify(data.user));
    return data.user;
  };

  const register = async (userData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || "Ro'yxatdan o'tishda xatolik");
      err.isExisting = data.isExisting;
      throw err;
    }
    setUser(data.user);
    localStorage.setItem("optomelektro_user", JSON.stringify(data.user));
    return data.user;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    localStorage.removeItem("optomelektro_user");
    localStorage.removeItem("optomelektro_guest");
    window.location.href = "/auth";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
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
