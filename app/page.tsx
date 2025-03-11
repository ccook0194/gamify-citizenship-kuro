'use client';

import { LandingButton } from '@/components/ui/landing-button';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { authorized, loading, login } = useAuth();
  const [password, setPassword] = useState('');

  const submitPassword = async () => {
    login(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative">
      <div className="fixed inset-0 pointer-events-none">
        <Image src="/cloudsblue.png" alt="Clouds" fill style={{ objectFit: 'cover' }} priority />
      </div>
      <div className="text-center space-y-8 mb-8">
        <h1 className="text-5xl font-bold [font-family:DynaPuff] text-[#53C3FF]">
          Kuro&apos;s Adventure
        </h1>
        <p className="text-slate-700 text-lg">Choose your destination</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <LandingButton href="/citizenship">Citizenship</LandingButton>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <Image
          src="/kurocat.png"
          alt="Kuro Cat"
          width={250}
          height={250}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
