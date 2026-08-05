"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authMode: "signin" | "signup";
  openAuthModal: (mode?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  login: (email: string, name?: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  // Load persistent user state from localStorage on client side
  useEffect(() => {
    const savedUser = localStorage.getItem("smt_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);

  const openAuthModal = (mode: "signin" | "signup" = "signin") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email: string, name?: string) => {
    const dummyUser: User = {
      id: "usr-001",
      name: name || "Gyan Vaibhav",
      email,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
      membershipTier: "Platinum Member",
      phone: "+91 98765 43210",
      savedTripsCount: 4,
      bookingsCount: 3,
    };
    setUser(dummyUser);
    localStorage.setItem("smt_user", JSON.stringify(dummyUser));
    setIsAuthModalOpen(false);
  };

  const register = (name: string, email: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
      membershipTier: "Platinum Member",
      phone: "+91 98765 43210",
      savedTripsCount: 0,
      bookingsCount: 0,
    };
    setUser(newUser);
    localStorage.setItem("smt_user", JSON.stringify(newUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smt_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
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
