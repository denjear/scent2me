'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../styles/globals.css';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 6000); 
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Logo */}
      <Image
        src="/images/logo.png"
        alt="Scent2Me Logo"
        width={500}
        height={500}
        priority
        className="animate-fade-scale"
      />

      {/* Footer text */}
      <p className="absolute bottom-4 text-sm text-[#A3B18A]">
        Scent2Me © 2025 All Rights Reserved.
      </p>
    </div>
  );
}
