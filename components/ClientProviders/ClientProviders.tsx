'use client';

import { SessionProvider } from 'next-auth/react';
import { ReduxProvider } from '@/redux/provider';
import { AuthProvider } from '@/context/AuthContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ReduxProvider>{children}</ReduxProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
