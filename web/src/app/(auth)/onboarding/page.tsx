'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CircleUser, UsersRound } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex bg-[#f8f2eb]"> 
      {/* kiri */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-16 rounded-r-[40px] drop-shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center mb-3">
          <Image
            src="/images/logo_polos.png"
            alt="Scent2Me logo"
            width={120}
            height={120}
          />
          <h1 className="text-5xl font-bold text-[#333]">Scent2Me</h1>
        </div>

        <p className="text-center text-gray-600 mb-8 max-w-md text-xl">
          Welcome to <span className="font-semibold">Scent2Me</span>! Sign in to
          discover your perfect fragrance!
        </p>

        <div className="flex flex-col items-center ">
          <button
            onClick={() => router.push('/login')}
            className="flex items-center justify-center w-100 py-4 bg-[#f3eadf] hover:bg-[#e8d9ca] rounded-xl text-[#222] font-bold shadow-sm cursor-pointer text-lg"
          >
            <UsersRound className="mr-3 w-8 h-8"/> Login with Account
          </button>

          <div className="flex items-center w-100 my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            onClick={() => router.push('/homepage')}
            className="flex items-center justify-center w-100 py-4 bg-[#f3eadf] hover:bg-[#e8d9ca] rounded-xl text-[#222] font-bold shadow-sm cursor-pointer text-lg"
          >
            <CircleUser className='mr-3 w-8 h-8'/>Login as Guest
          </button>

          <p className="text-sm text-gray-400 mt-6">
            Don’t have an account?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-[#5c5a9f] underline cursor-pointer font-semibold"
            >
              Sign up now!
            </button>
          </p>

          <p className="text-[#A3B18A] mt-6">
            Just one step to find the perfume that suits you!
          </p>
        </div>
      </div>

      {/* kanan */}
      <div className="w-1/2 bg-[#f8f2eb] flex flex-col justify-center items-center">
        <div className="flex flex-col items-center px-8">
          <Image
            src="/images/logo.png"
            alt="Scent2Me Large"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
