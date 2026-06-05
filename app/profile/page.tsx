"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "../../src/context/UserContext";
import { createClient } from "../../utils/supabase/client";
import { 
  ArrowLeft, User, Zap, Crown, Image as ImageIcon, 
  Calendar, Settings, LogOut, Clock, Layout, CreditCard, Shield
} from "lucide-react";

export default function ProfilePage() {
  const { profile, isLoading: profileLoading } = useUser();
  const supabase = createClient();
  
  const [generations, setGenerations] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "settings">("overview");

  // Fetch Image History from Supabase Database
  useEffect(() => {
    if (!profile?.id) return;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      const { data, error } = await supabase
        .from("image_generations")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setGenerations(data);
      }
      setLoadingHistory(false);
    };

    fetchHistory();
  }, [profile?.id]);

  // Loading State Protection
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#050704] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-lime-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Fallback if not logged in
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050704] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black mb-4">Unauthorized Access</h1>
        <p className="text-zinc-500 mb-8">Please sign in to view your neural profile.</p>
        <Link href="/sign-in" className="bg-lime-400 text-black px-6 py-3 rounded-xl font-bold">Return to Login</Link>
      </div>
    );
  }

  const isPremium = profile.plan_type === "premium";
  const isPro = profile.plan_type === "pro";
  const planColor = isPremium ? "text-amber-400" : isPro ? "text-lime-400" : "text-zinc-400";
  const badgeBg = isPremium ? "bg-amber-400/10 border-amber-500/30" : isPro ? "bg-lime-400/10 border-lime-500/30" : "bg-zinc-800/50 border-zinc-700";

  return (
    <div className="min-h-screen bg-[#050704] text-gray-200 font-sans selection:bg-lime-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-lime-400/5 rounded-full blur-[150px]" />
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 w-full h-20 bg-[#050704]/80 backdrop-blur-2xl border-b border-white/5 z-50 flex items-center px-6 md:px-12">
        <div className="flex-1">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="font-bold text-sm uppercase tracking-widest">Dashboard</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.3)]">
            <Layout className="text-black" size={16} strokeWidth={3} />
          </div>
          <span className="font-black text-xl tracking-wide text-white hidden sm:block">Morph<span className="text-lime-400">Grid</span></span>
        </div>
        <div className="flex-1 flex justify-end">
          <button className="text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-bold">
            <LogOut size={16} /> <span className="hidden sm:block">Sign Out</span>
          </button>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* Profile Identity Card */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#080B07] border border-white/5 rounded-[2rem] p-8 mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-lime-400/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1E291B] to-[#0A0D08] border border-lime-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(163,230,53,0.1)]">
              <User size={40} className="text-lime-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">{profile.full_name || "Neural Operator"}</h1>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badgeBg} ${planColor}`}>
                {isPremium ? <Crown size={10} /> : <Zap size={10} />}
                {profile.plan_type} Plan
              </div>
            </div>
          </div>

          <div className="flex gap-4 relative z-10 w-full md:w-auto">
             <Link href="/pricing" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold text-sm transition-all">
               <CreditCard size={16} /> Manage Plan
             </Link>
          </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex items-center gap-8 border-b border-white/5 mb-8">
          {[
            { id: "overview", label: "Overview", icon: Layout },
            { id: "history", label: "Generation History", icon: Clock },
            { id: "settings", label: "Security & Settings", icon: Shield },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors relative ${
                activeTab === tab.id ? "text-lime-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:block">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.5)]" />
              )}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT: OVERVIEW --- */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {/* Tokens Card */}
            <div className="bg-[#0A0D08] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center border border-lime-500/20">
                  <Zap size={20} className="text-lime-400" />
                </div>
                <Link href="/pricing" className="text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-lime-400 transition-colors">Top Up</Link>
              </div>
              <h3 className="text-zinc-400 text-sm font-bold tracking-widest uppercase mb-1">Available Tokens</h3>
              <p className="text-5xl font-black text-white tracking-tight">{isPremium ? "∞" : profile.token_balance}</p>
            </div>

            {/* Lifetime Stats */}
            <div className="bg-[#0A0D08] border border-white/5 p-6 rounded-3xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <ImageIcon size={20} className="text-zinc-400" />
                </div>
              </div>
              <h3 className="text-zinc-400 text-sm font-bold tracking-widest uppercase mb-1">Total Generations</h3>
              <p className="text-5xl font-black text-white tracking-tight">{generations.length}</p>
            </div>

            {/* Account Status */}
            <div className="bg-[#0A0D08] border border-white/5 p-6 rounded-3xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-500/20">
                  <Calendar size={20} className="text-amber-400" />
                </div>
              </div>
              <h3 className="text-zinc-400 text-sm font-bold tracking-widest uppercase mb-1">Account ID</h3>
              <p className="text-sm font-mono text-white truncate max-w-[200px] opacity-70">{profile.id}</p>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: HISTORY GRID --- */}
        {activeTab === "history" && (
          <div className="animate-in fade-in duration-500">
            {loadingHistory ? (
              <div className="py-20 text-center text-zinc-500 font-mono text-sm animate-pulse">
                Fetching neural archives...
              </div>
            ) : generations.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                <ImageIcon size={48} className="mx-auto text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Generations Yet</h3>
                <p className="text-zinc-500 mb-6">Initialize the engine on your dashboard to begin creating.</p>
                <Link href="/dashboard" className="inline-flex bg-lime-400 text-black px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:scale-105 transition-all">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {generations.map((gen) => (
                  <div key={gen.id} className="group relative aspect-square bg-[#0A0D08] border border-white/5 rounded-2xl overflow-hidden hover:border-lime-500/30 transition-all">
                    <img src={gen.image_url} alt={gen.style_reference} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-[10px] font-mono text-lime-400 mb-1 tracking-widest uppercase">{gen.style_reference || "Custom Style"}</p>
                      <p className="text-xs text-zinc-400">{new Date(gen.created_at).toLocaleDateString()}</p>
                      <a href={gen.image_url} download={`morphgrid-${gen.id}.jpg`} className="mt-3 text-xs bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-3 rounded-lg text-center backdrop-blur-sm transition-colors border border-white/10">
                        Download HD
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: SETTINGS --- */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-[#0A0D08] border border-white/5 rounded-3xl p-8 animate-in fade-in duration-500">
             <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2"><Settings size={20} className="text-lime-400"/> System Preferences</h2>
             
             <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">Display Name</label>
                  <input type="text" disabled value={profile.full_name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-400 cursor-not-allowed" />
                </div>
                
                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-sm font-bold text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-zinc-500 text-xs mb-4">Permanently erase your identity matrix and all generated assets from the server.</p>
                  <button className="bg-red-500/10 text-red-400 border border-red-500/20 px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
                    Delete Account
                  </button>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}