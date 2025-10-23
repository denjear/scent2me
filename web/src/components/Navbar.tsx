import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
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

        {/* === Bagian Kanan: Tombol Login === */}
        <div>
          <Link 
            href="/login"
            className="bg-[#A3B899] text-white font-bold px-8 py-2.5 rounded-lg 
                       hover:bg-[#93a78a] transition-colors inline-block"
          >
            Login
          </Link>
        </div>

      </nav>
    </header>
  );
}