"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../src/components/Navbar";

// Mock Data for Premium Aesthetic Templates
const TRENDING_NOW = [
  { id: "t1", title: "Cyber-Vanguard", category: "Sci-Fi", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" },
  { id: "t2", title: "Liquid Emerald Portrait", category: "Abstract", image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=600&auto=format&fit=crop" },
  { id: "t3", title: "90s Retro Couture", category: "Vintage", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop" },
  { id: "t4", title: "Dark Techwear Stealth", category: "Urban", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop" },
];

const EXPLORE_ITEMS = [
  { id: "e1", title: "Hyper-Real Cyber-Samurai", image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop" },
  { id: "e2", title: "Ethereal Glass Statue", image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop" },
  { id: "e3", title: "Neo-Classic Oil Painting", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop" },
  { id: "e4", title: "Bioluminescent Entity", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop" },
  { id: "e5", title: "Vogue Holographic Cover", image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600&auto=format&fit=crop" },
  { id: "e6", title: "Sandstorm Wasteland Drifter", image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=600&auto=format&fit=crop" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050704] text-gray-200 overflow-x-hidden font-sans antialiased">
      
      {/* Native CSS Injector for Premium Animated Orbs & Infinite Reels */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes meshGlow {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.2); }
          66% { transform: translate(-30px, 30px) scale(0.8); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes infiniteScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-mesh-1 { animation: meshGlow 12s infinite ease-in-out; }
        .animate-mesh-2 { animation: meshGlow 16s infinite ease-in-out 2s; }
        .animate-infinite-reel { animation: infiniteScroll 25s linear infinite; }
        .animate-infinite-reel:hover { animation-play-state: paused; }
      `}} />

      {/* --- HEADER NAVBAR --- */}
      <Navbar />

      {/* --- HERO MAIN BODY SECTION --- */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 flex flex-col items-center text-center overflow-hidden">
        
        {/* Expensive Animated Background Canvas Wrapper */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[500px] h-[400px] bg-[#1E291B] rounded-full blur-[140px] opacity-60 animate-mesh-1 mix-blend-screen" />
          <div className="absolute w-[350px] h-[350px] bg-[#A3E635]/10 rounded-full blur-[120px] opacity-40 animate-mesh-2 mix-blend-screen" />
          <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(5,7,4,0)_0%,rgba(5,7,4,0.9)_80%)]" />
        </div>

        {/* Content Badges & Headings */}
        <div className="inline-flex items-center space-x-2 bg-[#1E291B]/80 border border-[#3F523A] px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase text-gray-300">Identity Cloning v2.4</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1]">
          Clone Your Identity Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#A3E635] to-gray-400">Any High-End Aesthetic</span>
        </h1>
        
        <p className="text-gray-400 md:text-lg max-w-2xl mt-6 leading-relaxed">
          Zero intricate prompts required. Simply drop a fast portrait canvas to map your facial matrices instantly onto trending digital masterworks.
        </p>

       {/* Professional High-End CTA Callout Button */}
        <div className="mt-10">
          <Link 
            href="/pricing" 
            className="inline-block bg-white text-black font-extrabold tracking-wide px-8 py-4 rounded-xl shadow-[0_10px_30px_rgba(255,255,255,0.05)] hover:bg-gray-100 transition-all active:scale-[0.98] text-base group"
          >
            Initialize Neural Studio 
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform text-[#A3E635]">➔</span>
          </Link>
        </div>

      </section>

      {/* --- SECTION 1: TRENDING NOW (Grid Matrix) --- */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-[#1E291B]/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#A3E635] font-black">Style Tracker</h2>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">Trending Now</h3>
          </div>
          <p className="text-gray-500 text-sm max-w-xs mt-2 md:mt-0">The most requested creative directions across the network today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRENDING_NOW.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden bg-[#1E291B]/30 border border-[#3F523A]/40 hover:border-[#A3E635]/40 transition-all duration-300 p-3">
              <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-900">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] text-white font-bold tracking-wider px-2 py-0.5 rounded">
                  {item.category}
                </div>
              </div>
              <div className="mt-3 px-1 flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{item.title}</h4>
                <span className="text-[#A3E635] text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">⚡ Use Style</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 2: EXPLORE (Infinite Moving Reel) --- */}
      <section className="py-16 bg-[#090D08] border-y border-[#1E291B]/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center md:text-left">
          <h2 className="text-xs uppercase tracking-widest text-[#A3E635] font-black">Zero-Prompt Synthesis</h2>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">Explore & Mirror</h3>
          <p className="text-gray-400 text-sm mt-2 max-w-xl">
            See a target look you love? Skip the complex descriptive phrasing. Drop your selfie portrait blueprint directly into any track module below to duplicate the exact composition.
          </p>
        </div>

        {/* Track Wrap for Carousel Elements */}
        <div className="relative flex w-full overflow-x-hidden">
          <div className="flex space-x-6 animate-infinite-reel whitespace-nowrap py-4">
            
            {/* Double the array loops inside to maintain smooth seamlessly looping margins */}
            {[...EXPLORE_ITEMS, ...EXPLORE_ITEMS].map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                className="inline-block w-72 h-96 shrink-0 relative rounded-2xl overflow-hidden group cursor-pointer border border-[#3F523A]/30 hover:border-[#A3E635] shadow-lg transition-all duration-300"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                />
                
                {/* Gradient Inner Mask Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                {/* Frame Hover Card Actions */}
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end h-1/2">
                  <p className="text-xs text-[#A3E635] font-mono tracking-wider mb-1">Click to Clone</p>
                  <h4 className="text-base font-black text-white tracking-tight whitespace-normal leading-tight">{item.title}</h4>
                  
                  <div className="mt-4 bg-white text-black font-bold text-xs py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center space-x-1 shadow-md">
                    <span>⚡ Upload Selfie to Match</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* --- FOOTER BRACE --- */}
      <footer className="max-w-7xl mx-auto px-6 py-8 text-center text-xs text-gray-600">
        &copy; 2026 MorphGrid Engine. All rights reserved. Built using Next.js 15 & Supabase Serverless Infrastructure.
      </footer>

    </div>
  );
}