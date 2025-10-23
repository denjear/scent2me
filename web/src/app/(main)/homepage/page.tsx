"use client";

import Link from "next/link";

export default function Homepage() {
  return (
    <main
      className="relative w-full h-[100dvh] overflow-hidden font-poppins bg-[#faefe5]"
      style={{ overscrollBehavior: "none" }}
    >
      <div className="flex flex-col justify-between items-stretch h-full">
        {/* Hero Section */}
        <div className="relative flex flex-1 items-center justify-between px-20 lg:px-28 h-full">
          {/* Left side (Text) */}
          <div className="flex flex-col gap-6 max-w-xl z-10">
            <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] font-bold leading-[1.15] text-[#1a1a1a]">
              Find Your <br />
              <span className="font-extrabold text-[#1a1a1a]">
                Perfect Scent
              </span>
            </h1>

            <p className="text-[18px] sm:text-[20px] font-medium text-[#333333]">
              Personalized perfume recommendations just for you
            </p>

            {/* Button with redirect */}
            <Link href="/recommendations">
              <button className="bg-[#9DBE9C] hover:bg-[#8CAF8C] text-white font-semibold text-[16px] sm:text-[18px] px-8 py-3 rounded-lg w-fit transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>

          {/* Right side (Image + Gradient) */}
          <div className="absolute top-0 right-0 bottom-0 w-[52%] md:w-[55%] overflow-hidden">
            {/* Image */}
            <img
              src="/images/home_bg.png"
              alt="Perfume"
              className="w-full h-full object-cover object-[85%_center] scale-[1.05] select-none"
            />

            {/* Gradient (exactly like Figma) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, #F7EFE5 0%, rgba(247, 239, 229, 0.1) 100%)",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="h-[60px] flex items-center justify-center text-gray-500 text-sm font-medium bg-[#faefe5] z-20">
          Scent2Me © 2025 All Rights Reserved.
        </footer>
      </div>
    </main>
  );
}
