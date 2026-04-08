// 'use client';

// import React, { createContext, useContext, useState, ReactNode } from 'react';

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   token: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoggedIn: boolean;
//   login: (email: string, password: string) => boolean;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);

//   const login = (email: string, password: string) => {
//     // Mock authentication - accept any email/password combination
//     if (email && password) {
//       setUser({
//         id: Math.random().toString(36).substr(2, 9),
//         email,
//         name: email.split('@')[0],
//         token: '',
//       });
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// }

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
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean; // 👈 ADD THIS
  login: (email: string, password: string) => boolean;
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
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); // 👈 VERY IMPORTANT
  }, []);

  const login = (email: string, password: string) => {
    if (email && password) {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0],
        token: '', // You can generate a token here if needed
      };

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