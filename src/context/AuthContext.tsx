import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import type { User } from "../types";
import { useData } from "./DataContext";

interface AuthContextValue {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const CURRENT_USER_KEY = "students_lms_currentUserId";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { state } = useData();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CURRENT_USER_KEY);
    if (stored) setCurrentUserId(stored);
  }, []);

  const currentUser =
    state.users.find((u) => u.id === currentUserId) ?? null;

  const login = async (email: string, password: string) => {
    const user = state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      throw new Error("Invalid email or password");
    }
    setCurrentUserId(user.id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CURRENT_USER_KEY, user.id);
    }
  };

  const logout = () => {
    setCurrentUserId(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CURRENT_USER_KEY);
    }
  };

  const value: AuthContextValue = { currentUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
