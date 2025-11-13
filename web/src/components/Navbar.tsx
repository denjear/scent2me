'use client';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut, AlertCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ username?: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showWishlistNotif, setShowWishlistNotif] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      // Reset notification when user logs in
      setShowWishlistNotif(false);
    }

    // Click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/onboarding');
  };

  const handleWishlistClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault();
      setShowWishlistNotif(true);
    }
  };

  return (
    <header className="bg-[#F9F6F1] shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-3">
        
        {/* === Bagian Kiri: Logo dan Nama Brand === */}
        <Link href="/homepage" className="flex items-center gap-3">
          <Image
            src="/images/logo_polos.png"
            alt="Scent2Me Logo"
            width={50}
            height={50}
            priority
          />
          {/* Menggunakan nilai HEX untuk warna teks */}
          <span className="text-xl font-semibold text-[#4B4B4B]">
            Scent2Me
          </span>
        </Link>

        {/* === Bagian Tengah: Link Navigasi === */}
        <ul className="hidden md:flex items-center gap-10">
          <li>
            <Link href="/homepage" className="text-[#4B4B4B] font-semibold hover:opacity-75 transition-opacity">
              Home
            </Link>
          </li>
          <li>
            <Link href="/recommendations" className="text-[#4B4B4B] font-semibold hover:opacity-75 transition-opacity">
              Recommendations
            </Link>
          </li>
          <li>
            <Link href="/explore" className="text-[#4B4B4B] font-semibold hover:opacity-75 transition-opacity">
              Explore
            </Link>
          </li>
          <li>
            <Link 
              href="/wishlist" 
              onClick={handleWishlistClick}
              className="text-[#4B4B4B] font-semibold hover:opacity-75 transition-opacity"
            >
              Wishlist
            </Link>
          </li>
        </ul>

        {/* === Bagian Kanan: Login atau Username === */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer flex items-center gap-2 bg-[#A3B899] text-white font-bold px-4 py-2.5 rounded-lg hover:bg-[#93a78a] transition-colors"
              >
                <User size={20} />
                <span>{user.username}</span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer w-full flex items-center gap-2 px-4 py-2 text-[#4B4B4B] hover:bg-[#f3f3f3] transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link 
              href="/login"
              className="bg-[#A3B899] text-white font-bold px-8 py-2.5 rounded-lg 
                       hover:bg-[#93a78a] transition-colors inline-block"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Wishlist Login Notification */}
      {showWishlistNotif && (
        <div className="fixed top-20 left-1/2 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 flex flex-col items-center text-center z-50 animate-slide-in-top">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fff5f5] mb-3">
            <AlertCircle size={24} className="text-[#d32f2f]" />
          </div>
          <h2 className="text-lg font-semibold text-[#4B4B4B] mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            To save and view your wishlist, please login with your account.
          </p>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setShowWishlistNotif(false)}
              className="flex-1 px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Continue as Guest
            </button>
            <button
              onClick={() => {
                setShowWishlistNotif(false);
                router.push("/login");
              }}
              className="flex-1 px-3 py-2 text-sm bg-[#a6bfa3] text-white rounded-lg font-semibold hover:bg-[#93ad8f] transition"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}