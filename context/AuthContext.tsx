'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem('authorized');
    if (isAuth) {
      setAuthorized(true);
    }
    setLoading(false);
  }, []);

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
      localStorage.setItem('authorized', 'true');
    } else {
      alert('Invalid credentials');
    }
    router.push('/');
  };

  const logout = () => {
    setAuthorized(false);
    localStorage.removeItem('authorized');
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
