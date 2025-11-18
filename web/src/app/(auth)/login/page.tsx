'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { Eye, EyeOff, CircleAlert, X } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  
  // Add form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Add login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        router.push('/homepage');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  // Add clear error function
  const clearError = () => setError('');

  return (
    <div className="min-h-screen w-full flex bg-[#f8f2eb]"> 
      {/* kiri */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-16 rounded-r-[40px] drop-shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center">
          <Image
            src="/images/logo_polos.png"
            alt="Scent2Me logo"
            width={120}
            height={120}
          />
          <h1 className="text-5xl font-bold text-[#333]">Scent2Me</h1>
        </div>

        <p className="text-center text-gray-600 mb-4 max-w-md text-xl">
          Please login to continue your journey!
        </p>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-[#fff1f1] border border-[#ffcdd2] p-4 rounded-xl mb-6 w-full max-w-md">
            <CircleAlert className="text-[#d32f2f]" size={20} />
            <p className="text-[#d32f2f] text-sm font-medium flex-1">{error}</p>
            <button 
              onClick={clearError}
              className="hover:bg-[#ffcdd2] p-1 rounded-full transition-colors"
            >
              <X size={16} className="text-[#d32f2f]" />
            </button>
          </div>
        )}
    
        <div className="flex flex-col items-center">
          <form onSubmit={handleLogin} className='w-full max-w-md'>
            <div className='w-full max-w-md'>
              {/* Email */}
              <label className="block text-[#222] font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Your email address"
                className="w-100 bg-[#f3eadf] text-[#222] rounded-xl py-4 px-4 placeholder:text-[#777] focus:outline-none mb-4"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />

              {/* Password */}
              <label className="block text-[#222] font-semibold mb-2">
                Password
              </label>
              <div className="relative mb-6">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  className="w-100 bg-[#f3eadf] text-[#222] rounded-xl py-4 px-4 placeholder:text-[#777] focus:outline-none pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className='flex justify-center'>
             <button
                type="submit"
                className="w-50 py-3 bg-[#a6bfa3] hover:bg-[#93ad8f] text-white font-semibold rounded-3xl text-lg shadow-sm transition-colors cursor-pointer"
              >
                Login
              </button>
            </div>
             
          </form>

          <p className="text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
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
