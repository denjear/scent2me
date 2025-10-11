 'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white py-10 px-6">
      {/* Logo / Header */}
      <div className="mt-10">
        <Image
          src="/logo.png"
          alt="Scent2Me Logo"
          width={140}
          height={140}
          priority
        />
      </div>

      {/* Text Section */}
      <div className="text-center mt-10">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome to Scent2Me</h1>
        <p className="text-gray-500 mt-2">
          Find your perfect perfume — personalized for you.
        </p>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col gap-4 w-full max-w-xs mt-auto mb-16">
        <button
          onClick={() => router.push('/homepage')}
          className="w-full py-3 bg-[#A3B18A] text-white rounded-full font-medium hover:opacity-90 transition"
        >
          Continue as Guest
        </button>
        <button
          onClick={() => router.push('/login')}
          className="w-full py-3 border border-[#A3B18A] text-[#A3B18A] rounded-full font-medium hover:bg-[#A3B18A]/10 transition"
        >
          Login
        </button>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400">
        Scent2Me © 2025 All Rights Reserved.
      </p>
    </div>
  );
}
