'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('arcten_admin_token');
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (storedToken: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      
      if (res.ok) {
        setToken(storedToken);
      } else {
        localStorage.removeItem('arcten_admin_token');
      }
    } catch {
      localStorage.removeItem('arcten_admin_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        localStorage.setItem('arcten_admin_token', data.token);
        return { success: true, message: 'Login successful' };
      }

      return { success: false, message: data.message || 'Login failed' };
    } catch {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('arcten_admin_token');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, isLoading, login, logout }}>
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
