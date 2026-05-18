'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean; // 👈 ADD THIS
  login: (userData: User) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 👈 IMPORTANT

  // ✅ LOAD USER
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        id: parsedUser.id || '',
        email: parsedUser.email || '',
        name: parsedUser.name || '',
        role: parsedUser.role || '',
        token: parsedUser.token || '',
      });
    }

    setLoading(false); // 👈 VERY IMPORTANT
  }, []);

  const login = (userData: User) => {
    if (userData?.email) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // 🚫 BLOCK APP UNTIL LOADED (NO FLICKER)
  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}