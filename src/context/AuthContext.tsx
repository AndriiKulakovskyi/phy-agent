import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "admin";
  avatar?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(email, password);

      // Create user object with response data
      const loggedInUser: User = {
        id: response.id.toString(),
        name: response.name,
        email: response.email,
        role: response.role as "patient" | "admin",
        token: response.access_token,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.name}`,
      };

      // Save user to state and localStorage
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(name, email, password);

      // Create user object with response data
      const newUser: User = {
        id: response.id.toString(),
        name: response.name,
        email: response.email,
        role: response.role as "patient" | "admin",
        token: response.access_token,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.name}`,
      };

      // Save user to state and localStorage
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
