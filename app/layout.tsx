import type { Metadata } from 'next';
import NoiseOverlay from '@/components/NoiseOverlay';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import ClientProviders from '@/components/ClientProviders/ClientProviders';
import ImagesLinks from '@/utils/ImagesLinks';
import MobileRestriction from "@/components/MobileRestriction";

const title = "Kuro's Adventure";
const description =
  "An AI-powered adventure game where you can explore Kuro's universe and become a citizen!";

export const metadata: Metadata = {
  title,
  description,

  openGraph: {
    title,
    description,
    images: [ImagesLinks.welcomeCitizen],
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ImagesLinks.welcomeCitizen],
  },

  category: 'game',
  creator: 'Kuro',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 font-body">
        <ClientProviders>
          <MobileRestriction />
          {children}
          <NoiseOverlay />
        </ClientProviders>
      </body>
    </html>
  );
}
