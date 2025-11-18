"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Star } from "lucide-react";

export default function Homepage() {
  return (
    <main
      className="relative w-full h-screen overflow-hidden font-poppins bg-gradient-to-br from-[#f8f6ef] via-[#f0ede6] to-[#e9e4dc] animate-fadeIn"
      style={{ overscrollBehavior: "none" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/parfum_bg_pattern.png')] opacity-5 bg-repeat bg-center"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#A3B899]/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-[#9DBE9C]/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#B8D4B0]/15 rounded-full blur-lg animate-pulse delay-500"></div>

      <div className="relative z-10 flex flex-col justify-start items-center pt-12 pb-4 px-4 sm:px-8 md:px-16 lg:px-20 xl:px-28 h-full">

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl gap-12 lg:gap-8">

          {/* Left side (Text Content) */}
          <div className="flex flex-col gap-8 max-w-2xl text-center lg:text-left animate-slideInLeft">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm w-fit mx-auto lg:mx-0">
              <Sparkles size={16} className="text-[#A3B899]" />
              <span className="text-sm font-medium text-[#4B4B4B]">Personalized Recommendations</span>
            </div>

            <h1 className="
              text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl
              font-serif font-light leading-[0.9] tracking-tight
              bg-gradient-to-r from-[#2D2D2D] via-[#4B4B4B] to-[#2D2D2D] bg-clip-text text-transparent
              transition-all duration-700
              hover:scale-[1.02]
            ">
              Find Your<br />
              <span className="bg-gradient-to-r from-[#A3B899] via-[#9DBE9C] to-[#8CAF8C] bg-clip-text text-transparent font-medium">
                Perfect Scent
              </span>
            </h1>

            <p className="
              text-lg sm:text-xl md:text-2xl lg:text-3xl
              text-[#5A5A5A]
              font-light leading-relaxed
              max-w-xl
              transition-all duration-500
              hover:text-[#4B4B4B]
            ">
              Discover fragrances that match your personality, mood, and lifestyle through our intelligent recommendation system
            </p>



            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/recommendations">
                <button className="
                  group bg-gradient-to-r from-[#A3B899] to-[#9DBE9C]
                  hover:from-[#9DBE9C] hover:to-[#8CAF8C]
                  text-white font-semibold
                  text-lg sm:text-xl
                  px-8 sm:px-10 py-4 rounded-2xl
                  transition-all duration-300
                  shadow-lg hover:shadow-2xl
                  hover:scale-105 active:scale-95
                  backdrop-blur-sm
                  flex items-center gap-3
                  border border-white/20
                ">
                  Get Started
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link href="/explore">
                <button className="
                  bg-white/60 backdrop-blur-sm
                  hover:bg-white/80
                  text-[#4B4B4B] font-semibold
                  text-lg sm:text-xl
                  px-8 sm:px-10 py-4 rounded-2xl
                  transition-all duration-300
                  shadow-md hover:shadow-lg
                  hover:scale-105 active:scale-95
                  border border-white/30
                ">
                  Explore
                </button>
              </Link>
            </div>
          </div>

          {/* Right side (Image) */}
          <div className="relative flex-1 max-w-lg lg:max-w-xl xl:max-w-2xl">
            <div className="relative">
              {/* Main Image */}
              <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
                <img
                  src="/images/home_bg.png"
                  alt="Luxury Perfume Collection"
                  className="w-full h-auto rounded-2xl object-cover shadow-lg"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#A3B899]/20 to-[#9DBE9C]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#B8D4B0]/15 to-[#A3B899]/15 rounded-full blur-xl"></div>

              {/* Floating Cards */}
              <div className="absolute top-4 -left-8 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/40 animate-bounce delay-1000">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#A3B899] rounded-full"></div>
                  <span className="text-sm font-medium text-[#4B4B4B]">Floral</span>
                </div>
              </div>

              <div className="absolute bottom-8 -right-12 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/40 animate-bounce delay-2000">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#9DBE9C] rounded-full"></div>
                  <span className="text-sm font-medium text-[#4B4B4B]"></span>
                </div>
              </div>
            </div>
          </div>

        </div>



      </div>
    </main>
  );
}
