'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { Eye, EyeOff, CircleAlert, X } from 'lucide-react' // tambahkan import X

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Tambahkan fungsi handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        router.push('/login'); // Redirect ke login setelah register berhasil
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  // Tambahkan fungsi untuk menutup error message
  const clearError = () => setError('');

  return (
    <div className="min-h-screen w-full flex bg-[#f8f2eb]"> 
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

        <p className="text-center text-gray-600 mb-3 max-w-md text-xl">
          Create an account to get started!
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

        <div className="flex flex-col items-center ">
          <form onSubmit={handleSubmit} className='w-full max-w-md'>
            
            <div className='w-full max-w-md'>
              {/* Username */}
              <label className="block text-[#222] font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Your username"
                className="w-100 bg-[#f3eadf] text-[#222] rounded-xl py-4 px-4 placeholder:text-[#777] focus:outline-none mb-4"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />

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

            {/* Register Button */}
            <div className='flex justify-center'>
              <button
              type="submit"
              className="w-50 py-3 bg-[#a6bfa3] hover:bg-[#93ad8f] text-white font-semibold rounded-3xl text-lg shadow-sm transition-colors cursor-pointer"
              >
              Register
            </button>
            </div>
       
          </form>

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
