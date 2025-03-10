import type { Metadata } from 'next';
import NoiseOverlay from '@/components/NoiseOverlay';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import ClientProviders from '@/components/ClientProviders/ClientProviders';

export const metadata: Metadata = {
  title: "Kuro's Adventure",
  description: 'An AI-powered cat adventure game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 font-body">
        <ClientProviders>
          {children}
          <NoiseOverlay />
        </ClientProviders>
      </body>
    </html>
  );
}
