'use client';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ username?: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
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
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/onboarding');
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
            <Link href="/wishlist" className="text-[#4B4B4B] font-semibold hover:opacity-75 transition-opacity">
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
    </header>
  );
}