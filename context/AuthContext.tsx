"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "@/lib/types";
import { clearSession, getStoredUser, saveSession } from "@/lib/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = (newUser: User, token?: string) => {
    setUser(newUser);
    setError(null);
    if (token) saveSession(newUser, token);
  };

  const logout = () => {
    setUser(null);
    setError(null);
    clearSession();
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
