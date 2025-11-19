'use client';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut, AlertCircle, Menu, X, Home, Search, Compass, Heart } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ username?: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWishlistNotif, setShowWishlistNotif] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      // Reset notification when user logs in
      setShowWishlistNotif(false);
    }

    // Click outside to close dropdown and mobile menu
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
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
    const user = localStorage.getItem('user');
    if (!user) {
      e.preventDefault();
      setShowWishlistNotif(true);
    }
  };

  const navItems = [
    { href: '/homepage', label: 'Home', icon: Home },
    { href: '/recommendations', label: 'Recommendations', icon: Search },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/wishlist', label: 'Wishlist', icon: Heart, onClick: handleWishlistClick },
  ];

  return (
    <header className="neu-navbar glassmorphism shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        
        {/* === Bagian Kiri: Logo dan Nama Brand === */}
        <Link href="/homepage" className="flex items-center gap-3 transition-all duration-300">
          <Image
            src="/images/logo_polos.png"
            alt="Scent2Me Logo"
            width={50}
            height={50}
            priority
            className="icon-bounce"
          />
          <span className="text-xl font-bold text-[#4B4B4B] bg-gradient-to-r from-[#4B4B4B] to-[#6B6B6B] bg-clip-text text-transparent">
            Scent2Me
          </span>
        </Link>

        {/* === Bagian Tengah: Link Navigasi Desktop === */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map(({ href, label, icon: Icon, onClick }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={onClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover-lift ${
                  pathname === href
                    ? 'text-[#A3B899] active-link'
                    : 'text-[#4B4B4B] hover:text-[#A3B899] hover:bg-[#f0ede6]'
                }`}
              >
                <Icon size={18} className="icon-bounce" />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* === Hamburger Menu for Mobile === */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-[#f0ede6] transition-colors duration-300"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* === Bagian Kanan: Login atau Username === */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          {user ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="neu-button logo-hover cursor-pointer flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-lg transition-all duration-300"
              >
                <User size={20} className="icon-bounce" />
                <span>{user.username}</span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glassmorphism rounded-lg shadow-xl py-2 border border-white/20 animate-slide-in-right">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-[#4B4B4B] hover:bg-[#f0ede6] transition-colors duration-300 rounded-lg mx-2"
                  >
                    <LogOut size={18} className="icon-bounce" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="cursor-pointer text-white font-bold px-8 py-2.5 rounded-lg transition-all duration-300 inline-block bg-[#a7c3a1]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            ref={mobileMenuRef}
            className="absolute right-0 top-0 h-full w-80 glassmorphism shadow-2xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold text-[#4B4B4B]">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-[#f0ede6] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <ul className="space-y-4">
                {navItems.map(({ href, label, icon: Icon, onClick }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={(e) => {
                        onClick?.(e);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover-lift ${
                        pathname === href
                          ? 'text-[#A3B899] bg-[#f0ede6] active-link'
                          : 'text-[#4B4B4B] hover:text-[#A3B899] hover:bg-[#f0ede6]'
                      }`}
                    >
                      <Icon size={20} className="icon-bounce" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-200">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#f0ede6] rounded-lg">
                      <User size={20} />
                      <span className="font-semibold">{user.username}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full neu-button hover-lift flex items-center gap-3 px-4 py-3 text-white font-bold rounded-lg transition-all duration-300"
                    >
                      <LogOut size={20} className="icon-bounce" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full neu-button hover-lift flex items-center justify-center gap-3 px-4 py-3 text-white font-bold rounded-lg transition-all duration-300 inline-block"
                  >
                    <User size={20} className="icon-bounce" />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
              className="cursor-pointer flex-1 px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Continue as Guest
            </button>
            <button
              onClick={() => {
                setShowWishlistNotif(false);
                router.push("/login");
              }}
              className="cursor-pointer flex-1 px-3 py-2 text-sm bg-[#a6bfa3] text-white rounded-lg font-semibold hover:bg-[#93ad8f] transition"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}