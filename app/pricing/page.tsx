"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "../../src/context/UserContext";
import { useRouter } from "next/navigation";
import {
  Zap, Check, X, ArrowRight, Layout, Sparkles,
  Image, Crown, Shield, Infinity, ChevronRight, Star,
  Clock, Lock, Cpu, Globe
} from "lucide-react";

type Plan = "free" | "pro" | "premium";

const PLANS = [
  {
    id: "free" as Plan,
    name: "Free",
    badge: null,
    tagline: "Try the matrix",
    price: 0,
    period: null,
    tokens: 3,
    tokenLabel: "3 images/day",
    tokenReset: "Resets every 24h",
    color: "zinc",
    accentClass: "text-zinc-400",
    borderClass: "border-zinc-800 hover:border-zinc-600",
    badgeClass: "bg-zinc-800 text-zinc-300 border-zinc-700",
    glowClass: "",
    btnClass: "bg-white/10 hover:bg-white/20 text-white border border-white/10",
    iconBg: "bg-zinc-800",
    features: [
      { text: "3 image generations per day", available: true },
      { text: "720p output resolution", available: true },
      { text: "Standard processing speed", available: true },
      { text: "5 reference style templates", available: true },
      { text: "Watermarked exports", available: true },
      { text: "HD / 4K output", available: false },
      { text: "Priority GPU queue", available: false },
      { text: "Commercial license", available: false },
      { text: "Batch generation", available: false },
      { text: "API access", available: false },
    ],
  },
  {
    id: "pro" as Plan,
    name: "Pro",
    badge: "Most Popular",
    tagline: "Unlock the grid",
    price: 12,
    period: "/mo",
    tokens: 150,
    tokenLabel: "150 images/month",
    tokenReset: "Monthly rollover",
    color: "lime",
    accentClass: "text-lime-400",
    borderClass: "border-lime-500/50 hover:border-lime-400",
    badgeClass: "bg-lime-400/10 text-lime-400 border-lime-500/30",
    glowClass: "shadow-[0_0_60px_rgba(163,230,53,0.15)]",
    btnClass: "bg-lime-400 hover:bg-lime-300 text-black font-extrabold shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)]",
    iconBg: "bg-lime-400/10",
    features: [
      { text: "150 image generations per month", available: true },
      { text: "HD 1080p output resolution", available: true },
      { text: "Fast processing (priority queue)", available: true },
      { text: "All 200+ style templates", available: true },
      { text: "Watermark-free exports", available: true },
      { text: "HD / 4K output", available: true },
      { text: "Priority GPU queue", available: true },
      { text: "Commercial license", available: false },
      { text: "Batch generation", available: false },
      { text: "API access", available: false },
    ],
  },
  {
    id: "premium" as Plan,
    name: "Premium",
    badge: "Full Power",
    tagline: "Own the neural stack",
    price: 39,
    period: "/mo",
    tokens: 999,
    tokenLabel: "Unlimited generations",
    tokenReset: "No daily cap · No rollover",
    color: "amber",
    accentClass: "text-amber-400",
    borderClass: "border-amber-500/40 hover:border-amber-400",
    badgeClass: "bg-amber-400/10 text-amber-400 border-amber-500/30",
    glowClass: "shadow-[0_0_60px_rgba(251,191,36,0.12)]",
    btnClass: "bg-amber-400 hover:bg-amber-300 text-black font-extrabold shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]",
    iconBg: "bg-amber-400/10",
    features: [
      { text: "Unlimited image generations", available: true },
      { text: "Ultra 4K output resolution", available: true },
      { text: "Instant GPU burst (max speed)", available: true },
      { text: "All 200+ style templates", available: true },
      { text: "Watermark-free exports", available: true },
      { text: "HD / 4K output", available: true },
      { text: "Priority GPU queue", available: true },
      { text: "Full commercial license", available: true },
      { text: "Batch generation (up to 20x)", available: true },
      { text: "API access + webhooks", available: true },
    ],
  },
];

// Floating orb background
const OrbCanvas = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-lime-400/5 rounded-full blur-[160px] animate-[meshGlow_14s_ease-in-out_infinite]" />
    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-[140px] animate-[meshGlow_18s_ease-in-out_infinite_2s]" />
    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-400/4 rounded-full blur-[120px]" />
  </div>
);

export default function PricingPage() {
    const { profile } = useUser();
  const router = useRouter();
  const handlePlanSelection = (planId: string) => {
    if (!profile) {
      // Not logged in? Send them to the sign-in page, but tell the page they want to upgrade!
      router.push(`/sign-in?redirect=pricing`);
    } else {
      // ALREADY LOGGED IN! 
      // This is where you trigger your payment gateway (Stripe, Razorpay, etc.)
      
      console.log(`Initiating checkout for user ${profile.id} for plan ${planId}`);
      
      // Example: Redirect to a checkout API route
      // router.push(`/api/checkout?plan=${planId}&userId=${profile.id}`);
      
      // For now, let's just show an alert so you know it works:
      alert(`Connecting ${profile.full_name} to the payment gateway for the ${planId} plan!`);
    }
  };
  const [hoveredPlan, setHoveredPlan] = useState<Plan | null>(null);


  return (
    <div className="min-h-screen bg-[#050704] text-gray-200 font-sans antialiased overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
        * { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        @keyframes meshGlow {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #a3e635, #d9f99d, #86efac, #a3e635);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .amber-shimmer {
          background: linear-gradient(90deg, #fbbf24, #fde68a, #f59e0b, #fbbf24);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .card-float { animation: float 6s ease-in-out infinite; }
        .animate-scan { animation: scanline 3s linear infinite; }
        .popular-glow { box-shadow: 0 0 0 1px rgba(163,230,53,0.3), 0 0 60px rgba(163,230,53,0.15), inset 0 0 60px rgba(163,230,53,0.03); }
        .premium-glow { box-shadow: 0 0 0 1px rgba(251,191,36,0.3), 0 0 60px rgba(251,191,36,0.12), inset 0 0 60px rgba(251,191,36,0.03); }
      `}} />

      <OrbCanvas />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full h-16 bg-[#050704]/80 backdrop-blur-2xl border-b border-white/5 z-50 flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-lime-400 flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.3)]">
            <Layout className="text-black" size={18} strokeWidth={3} />
          </div>
          <span className="font-black text-xl tracking-wide text-white">Morph<span className="text-lime-400">Grid</span></span>
        </Link>

       <div className="flex items-center gap-4">
          {profile ? (
            <Link href="/dashboard" className="bg-lime-400 hover:bg-lime-300 text-black px-6 py-2.5 rounded-full text-sm font-extrabold transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)]">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-zinc-400 hover:text-white text-sm font-semibold transition-colors">Sign In</Link>
              <Link href="/sign-in" className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-full text-sm font-bold transition-all">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-36 pb-16 text-center px-6 relative">
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#a3e635 1px, transparent 1px), linear-gradient(90deg, #a3e635 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="inline-flex items-center gap-2 bg-[#1E291B]/80 border border-[#3F523A] px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse shadow-[0_0_6px_#a3e635]" />
          <span className="text-xs font-bold tracking-widest uppercase text-zinc-300">Neural Credit System</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.05] mb-6">
          Choose Your <br />
          <span className="shimmer-text">Image Generation</span> Plan
        </h1>

        <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
          One token, one image. No prompt engineering required — just drop your selfie and select a style.
        </p>

        {/* Token = Image clarifier */}
        <div className="inline-flex items-center gap-3 mt-8 bg-[#0A0D08] border border-[#2A3A25] rounded-2xl px-6 py-3">
          <Zap size={16} className="text-lime-400 fill-lime-400/20" />
          <span className="font-mono text-sm text-zinc-300"><span className="text-lime-400 font-bold">1 Token</span> = 1 Image Generation</span>
          <span className="w-px h-4 bg-zinc-700" />
          <Image size={16} className="text-zinc-500" />
          <span className="font-mono text-sm text-zinc-500">No prompts needed</span>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {PLANS.map((plan, i) => {
            const isPopular = plan.id === "pro";
            const isPremium = plan.id === "premium";
            const isFree = plan.id === "free";

            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative rounded-3xl border bg-[#080B07]/80 backdrop-blur-xl p-8 flex flex-col transition-all duration-500 cursor-pointer
                  ${plan.borderClass}
                  ${isPopular ? "popular-glow md:-translate-y-4 md:scale-[1.02]" : ""}
                  ${isPremium ? "premium-glow" : ""}
                  ${hoveredPlan === plan.id ? "scale-[1.02]" : ""}
                  ${isPopular && hoveredPlan !== plan.id ? "md:scale-[1.02] md:-translate-y-4" : ""}
                `}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Scan line for popular plan */}
                {isPopular && (
                  <div className="absolute left-0 right-0 h-px bg-lime-400 shadow-[0_0_15px_#a3e635] opacity-40 animate-scan pointer-events-none" />
                )}

                {/* Corner accents for premium */}
                {isPremium && (
                  <>
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/40 rounded-tl" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/40 rounded-tr" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400/40 rounded-bl" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400/40 rounded-br" />
                  </>
                )}

                {/* Badge */}
                {plan.badge ? (
                  <div className={`inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-6 ${plan.badgeClass}`}>
                    {isPopular && <Star size={10} className="fill-lime-400" />}
                    {isPremium && <Crown size={10} className="fill-amber-400" />}
                    {plan.badge}
                  </div>
                ) : (
                  <div className="h-7 mb-6" /> // spacer to align cards
                )}

                {/* Plan name + tagline */}
                <div className="mb-6">
                  <h2 className={`text-3xl font-black tracking-tight mb-1 ${
                    isFree ? "text-white" :
                    isPopular ? "shimmer-text" :
                    "amber-shimmer"
                  }`}>{plan.name}</h2>
                  <p className="text-zinc-500 text-sm">{plan.tagline}</p>
                </div>

                {/* Pricing */}
                <div className="mb-6 flex items-end gap-1">
                  {plan.price === 0 ? (
                    <span className="text-5xl font-black text-white">Free</span>
                  ) : (
                    <>
                      <span className="text-zinc-500 text-xl font-bold mb-2">$</span>
                      <span className="text-5xl font-black text-white">{plan.price}</span>
                      <span className="text-zinc-500 text-sm mb-2">{plan.period}</span>
                    </>
                  )}
                </div>

                {/* Token count block */}
                <div className={`rounded-2xl border p-4 mb-6 ${plan.badgeClass} bg-transparent`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={14} className={plan.accentClass} />
                    <span className={`font-mono text-sm font-bold ${plan.accentClass}`}>{plan.tokenLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-zinc-600" />
                    <span className="text-zinc-500 text-xs font-mono">{plan.tokenReset}</span>
                  </div>
                </div>

                {/* CTA Button */}
               <button
                  onClick={() => handlePlanSelection(plan.id)}
                  className={`w-full py-3.5 rounded-xl text-sm font-black tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 mb-8 ${plan.btnClass}`}
                >
                  {profile ? (isFree ? "Current Plan" : `Upgrade to ${plan.name}`) : (isFree ? "Start Free" : `Get ${plan.name}`)}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Divider */}
                <div className="w-full h-px bg-white/5 mb-6" />

                {/* Features list */}
                <div className="space-y-3 flex-1">
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-4">What's included</p>
                  {plan.features.map((f, j) => (
                    <div key={j} className={`flex items-start gap-3 ${!f.available ? "opacity-30" : ""}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        f.available 
                          ? isPopular ? "bg-lime-400/10 border border-lime-400/30"
                          : isPremium ? "bg-amber-400/10 border border-amber-400/30"
                          : "bg-zinc-700/50 border border-zinc-600/30"
                          : "bg-zinc-800/50 border border-zinc-700/20"
                      }`}>
                        {f.available 
                          ? <Check size={11} className={plan.accentClass} strokeWidth={3} />
                          : <X size={11} className="text-zinc-600" strokeWidth={3} />
                        }
                      </div>
                      <span className={`text-sm leading-snug ${f.available ? "text-zinc-300" : "text-zinc-600 line-through decoration-zinc-700"}`}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust strip below cards */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-10 border-t border-white/5">
          {[
            { icon: Shield, text: "No card required for free" },
            { icon: Lock, text: "256-bit encrypted payments" },
            { icon: Cpu, text: "Cancel anytime, instantly" },
            { icon: Globe, text: "Works worldwide" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-zinc-500 text-sm">
              <item.icon size={14} className="text-zinc-600" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ROW */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-black text-white text-center mb-10">Common Questions</h2>
        <div className="space-y-3">
          {[
            {
              q: "What happens when I run out of tokens?",
              a: "Free users can wait for the daily reset (every 24h). Pro and Premium users can top up or upgrade their plan. You'll never be charged automatically."
            },
            {
              q: "Can I switch plans anytime?",
              a: "Yes. Upgrade instantly and get pro-rated credits. Downgrading takes effect at the next billing cycle."
            },
            {
              q: "Do unused tokens roll over?",
              a: "Pro plan tokens roll over for one month. Premium is unlimited so rollover doesn't apply. Free tokens reset daily."
            },
            {
              q: "What does the commercial license cover?",
              a: "Premium users can use all generated images in commercial projects, client work, social media campaigns, and print. Free and Pro are personal use only."
            },
          ].map((faq, i) => (
            <details key={i} className="group bg-[#0A0D08] border border-[#1E291B] rounded-2xl overflow-hidden cursor-pointer">
              <summary className="flex items-center justify-between px-6 py-4 font-bold text-zinc-300 hover:text-white transition-colors list-none">
                {faq.q}
                <ChevronRight size={16} className="text-zinc-600 group-open:rotate-90 transition-transform duration-300 shrink-0 ml-4" />
              </summary>
              <div className="px-6 pb-5 text-zinc-500 text-sm leading-relaxed border-t border-white/5 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1E291B]/60 py-8 text-center text-xs text-zinc-700">
        © 2026 MorphGrid Engine. All rights reserved. Built with Next.js 15 & Supabase.
      </footer>
    </div>
  );
}