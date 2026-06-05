"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-[#1E291B]/80 bg-[#050704]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 cursor-pointer group">
          <div className="h-8 w-8 rounded-lg bg-[#A3E635] flex items-center justify-center font-black text-black shadow-[0_0_15px_rgba(163,230,53,0.3)] group-hover:scale-105 transition-transform">
            ∑
          </div>
          <span className="text-lg font-black tracking-wider text-white uppercase">
            Morph<span className="text-[#A3E635]">Grid</span>
          </span>
        </Link>
        
        {/* Right Navigation Controls */}
        <div className="flex items-center space-x-8">
          <Link href="pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Pricing
          </Link>
          
          {/* This is a hard-coded link to the sign-in page */}
          <Link 
            href="/sign-in"
            className="bg-white text-black text-sm font-bold px-5 py-2 rounded-full hover:bg-gray-100 transition-all shadow-md active:scale-95"
          >
            SignUp
          </Link>
        </div>

      </div>
    </nav>
  );
}