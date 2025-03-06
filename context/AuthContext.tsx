'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

// Define the Auth Context type
interface AuthContextType {
  authorized: boolean;
  loading: boolean;
  login: (password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem('authorized');
    if (isAuth) {
      setAuthorized(true);
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = async (password: string) => {
    setLoading(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);

    if (res.ok) {
      setAuthorized(true);
      localStorage.setItem('authorized', JSON.stringify(true));
    } else {
      alert('Invalid credentials');
    }
    router.push('/');
  };

  // Logout Function
  const logout = () => {
    setAuthorized(false);
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <SessionProvider>
      <AuthContext.Provider value={{ authorized, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
};

// Custom Hook to use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
