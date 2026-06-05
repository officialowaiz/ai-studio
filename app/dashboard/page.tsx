"use client";
import { useUser } from "../../src/context/UserContext";
import { useState, useEffect } from "react";
import {
  Menu, Sparkles, User, Info, ImagePlus, Layout, Monitor,
  Smartphone, Square, Download, RefreshCw, X, History,
  Bookmark, Shield, LogOut, ChevronRight, Camera, CheckCircle2,
  ScanFace, Zap, Plus, Globe, Terminal, MessageSquare, Circle, AlertTriangle, Loader2
} from "lucide-react";

// IMPORTANT: Import your separated component here
import ExploreModal from "../explore/ExploreModal";
import { useRouter } from "next/navigation"; // <-- Add this
import TokenBadge from "../../src/components/TokenBadge";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";

const ASPECT_RATIOS = [
  { id: "sq", label: "1:1", icon: Square, desc: "Square" },
  { id: "port", label: "4:5", icon: Layout, desc: "Portrait" },
  { id: "land", label: "16:9", icon: Monitor, desc: "Landscape" },
  { id: "story", label: "9:16", icon: Smartphone, desc: "Story" },
];

// --- Enhanced Visual Selfie Guide Modal ---
const SelfieGuideModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-[#050704]/90 z-[999] flex items-center justify-center backdrop-blur-xl p-4 animate-in fade-in zoom-in-95 duration-300">
    <div className="bg-[#0A0D08] border border-lime-500/20 rounded-3xl p-8 max-w-md w-full relative shadow-[0_0_80px_rgba(163,230,53,0.1)]">
      <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white hover:rotate-90 transition-all duration-300">
        <X size={24} />
      </button>

      {/* Visual Guide Element */}
      <div className="relative w-40 h-40 mx-auto mb-8 bg-[#050704] rounded-full border border-[#2A3A25] flex items-center justify-center shadow-inner overflow-hidden group">
        {/* Animated Scanner Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(163,230,53,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.1)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
        {/* Scanner Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-lime-400 shadow-[0_0_15px_#a3e635] animate-scan" />

        {/* Subject */}
        <ScanFace size={80} strokeWidth={1} className="text-zinc-500 relative z-10 transition-colors group-hover:text-lime-400/80" />

        {/* Focus Brackets */}
        <div className="absolute inset-6 border-2 border-dashed border-lime-500/40 rounded-3xl z-20 animate-pulse-ring" />

        {/* Camera Indicator */}
        <div className="absolute top-4 right-4 bg-lime-400 text-black p-1.5 rounded-full z-30 shadow-[0_0_10px_#a3e635]">
          <Camera size={14} />
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-white font-extrabold text-2xl mb-2 font-space">Perfect Capture Guide</h3>
        <p className="text-zinc-400 text-sm">Align features with the biometric grid for optimal AI extraction.</p>
      </div>

      <div className="space-y-3">
        {[
          { title: "Direct Lighting", desc: "Face a natural light source. Avoid harsh shadows." },
          { title: "Center Alignment", desc: "Look directly at the lens. Keep facial features centered." },
          { title: "Clear Features", desc: "Remove sunglasses, hats, or facial obstructions." },
        ].map((tip, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/10 hover:border-lime-500/30 hover:bg-lime-500/5 transition-colors rounded-2xl items-start">
            <CheckCircle2 className="text-lime-400 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-white font-bold text-sm mb-1">{tip.title}</p>
              <p className="text-zinc-400 text-xs leading-relaxed">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onClose} className="w-full mt-8 py-4 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(163,230,53,0.2)] transition-all hover:scale-[1.02]">
        Initialize Upload
      </button>
    </div>
  </div>
);

// --- Logout Confirmation Modal ---
const LogoutConfirmModal = ({ onConfirm, onClose }: { onConfirm: () => void, onClose: () => void }) => (
  <div className="fixed inset-0 bg-[#050704]/90 z-[999] flex items-center justify-center backdrop-blur-xl p-4 animate-in fade-in zoom-in-95 duration-300">
    <div className="bg-[#0A0D08] border border-red-500/20 rounded-3xl p-8 max-w-sm w-full relative shadow-[0_0_80px_rgba(239,68,68,0.1)] text-center">
      
      <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        <AlertTriangle size={32} className="text-red-400" />
      </div>

      <h3 className="text-white font-black text-2xl mb-2 tracking-tight">Terminate Session?</h3>
      <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
        Are you sure you want to log out? You will need to re-authenticate to access the neural grid.
      </p>

      <div className="flex gap-3">
        <button 
          onClick={onClose} 
          className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all border border-white/10"
        >
          Cancel
        </button>
        <button 
          onClick={onConfirm} 
          className="flex-1 py-3.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-bold text-sm transition-all border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
        >
          Confirm Logout
        </button>
      </div>
    </div>
  </div>
);

// --- Background Bubbles Component ---
const AmbientBubbles = () => {
  // Generates random bubbles to float up in the background
  const [bubbles, setBubbles] = useState<any[]>([]);
  useEffect(() => {
    setBubbles([...Array(12)].map((_, i) => ({
      id: i,
      size: Math.random() * 120 + 40,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
    })));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute rounded-full border border-lime-400/10 bg-lime-400/5 backdrop-blur-[2px] bubble-anim"
          style={{
            width: `${b.size}px`, height: `${b.size}px`,
            left: b.left, bottom: '-150px',
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function MorphGridDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selfieFile, setSelfieFile] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<any>(null);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  const [showGuide, setShowGuide] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isNavigatingProfile, setIsNavigatingProfile] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [generationPhase, setGenerationPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  const phases = [
    "Initializing neural pathways...", "Extracting facial geometry...",
    "Encoding identity matrix...", "Applying style transfer layers...",
    "Upscaling to high-resolution...", "Finalizing synthesis...",
  ];


  const router = useRouter();
  const { profile, refreshProfile } = useUser();
  const supabase = createClient(); // <-- Add this line

  // Set clean fallbacks while the database profile loads
  const tokens = profile?.token_balance ?? 0;
  const totalGens = profile?.total_generations ?? 0;
  const userPlan = profile?.plan_type ?? "free";

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelfieFile(URL.createObjectURL(file));
    setOutputImage(null);
  };

  const handleGenerate = () => {
    if (!selfieFile || !referenceImage) return;

    // 1. Check if they have enough tokens
    if (userPlan !== "premium" && tokens <= 0) {
      alert("Out of tokens! Please upgrade to generate more.");
      router.push('/pricing');
      return;
    }

    setIsGenerating(true); setOutputImage(null); setProgress(0); setGenerationPhase(0);

    let prog = 0;
    const timer = setInterval(() => {
      prog += 100 / (8000 / 80);
      setProgress(Math.min(prog, 100));
      setGenerationPhase(Math.floor((prog / 100) * phases.length) || 0);

     if (prog >= 100) {
        clearInterval(timer);
        
        // Change to async so we can talk to the database
        setTimeout(async () => {
          if (!profile?.id) return;

        try {
            // 1. Prepare the image (Convert your output/reference to a usable file)
            // Note: If you are using a real AI API, you would replace this fetch
            const response = await fetch(referenceImage.thumb);
            const blob = await response.blob();
            
            // This path format '${profile.id}/...' is required by your Storage Policy!
            const fileName = `${profile.id}/${Date.now()}.jpg`;

            // 2. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
              .from('generations')
              .upload(fileName, blob);

            if (uploadError) throw uploadError;

            // 3. Get the public URL for the database
            const { data: { publicUrl } } = supabase.storage
              .from('generations')
              .getPublicUrl(fileName);

            // 4. SAVE TO GENERATION HISTORY with the REAL URL
            await supabase.from("image_generations").insert({
              user_id: profile.id,
              style_reference: referenceImage.name,
              image_url: publicUrl, 
              aspect_ratio: selectedRatio.label
            });

            // 5. DEDUCT THE TOKEN
            if (userPlan !== "premium" && tokens > 0) {
              await supabase
                .from("profiles")
                .update({ 
                  token_balance: tokens - 1,
                  total_generations: (profile.total_generations || 0) + 1 
                })
                .eq("id", profile.id);
            } else if (userPlan === "premium") {
               await supabase
                .from("profiles")
                .update({ total_generations: (profile.total_generations || 0) + 1 })
                .eq("id", profile.id);
            }

            // 6. UPDATE UI & REFRESH
            setIsGenerating(false);
            setOutputImage(publicUrl); // Show the uploaded image
            setHistory(prev => [{ id: Date.now(), thumb: publicUrl, name: referenceImage.name }, ...prev.slice(0, 9)]);
            refreshProfile();
            
          } catch (error) {
            console.error("Failed to save generation:", error);
            setIsGenerating(false);
          }
        }, 500);
      }
    }, 80);
  };

  const handleLogout = async () => {
    // 1. Tell Supabase to destroy the secure session cookie
    await supabase.auth.signOut();
    
    // 2. Clear the global memory
    refreshProfile();
    
    // 3. Send them back to the login screen
    router.push('/sign-in');
  };

  const canGenerate = selfieFile && referenceImage;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        @keyframes scanline { 0% { transform: translateY(-50px); opacity: 0;} 50% {opacity: 1;} 100% { transform: translateY(160px); opacity: 0; } }
        .animate-scan { animation: scanline 2.5s ease-in-out infinite; }
        
        @keyframes float-up { 0% { transform: translateY(0) scale(0.8); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 0.8; } 100% { transform: translateY(-100vh) scale(1.2); opacity: 0; } }
        .bubble-anim { animation: float-up linear infinite; }
        
        @keyframes pulse-ring { 0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(163, 230, 53, 0.4); } 70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(163, 230, 53, 0); } 100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(163, 230, 53, 0); } }
        .animate-pulse-ring { animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
        
        .data-stream { background: linear-gradient(90deg, transparent, rgba(163,230,53,0.2), transparent); background-size: 200% 100%; animation: stream 2s linear infinite; }
        @keyframes stream { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
      `}</style>

      <div className="min-h-screen bg-[#050704] text-zinc-300 font-space selection:bg-lime-500/30 relative">
        <AmbientBubbles />

        {/* --- HEADER --- */}
        <header className="fixed top-0 w-full h-20 bg-[#050704]/70 backdrop-blur-2xl border-b border-white/5 z-50 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-lime-400 transition-colors p-2 -ml-2">
              <Menu size={28} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                <Layout className="text-black" size={20} strokeWidth={3} />
              </div>
              <span className="font-black text-2xl tracking-wide text-white">Morph<span className="text-lime-400">Grid</span></span>
            </div>
          </div>

          {/* Right side of the Header */}
          <div className="flex items-center gap-4 md:gap-6">

            {/* Premium Credit Badge (Dynamic) */}
            <TokenBadge
              tokens={tokens}
              plan={userPlan}
              onUpgrade={() => router.push('/pricing')}
            />

            <div className="w-px h-6 bg-white/10 hidden md:block" /> {/* Divider */}

            <button onClick={() => setShowExplore(true)} className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-amber-400/10 hover:text-amber-400 hover:border-amber-400/30 transition-all">
              <ImagePlus size={18} /> Explore Styles
            </button>

<button 
              onClick={() => {
                setIsNavigatingProfile(true);
                router.push('/profile');
              }}
              disabled={isNavigatingProfile}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1E291B] to-[#0A0D08] border border-[#2A3A25] flex items-center justify-center cursor-pointer hover:border-lime-400/50 hover:shadow-[0_0_15px_rgba(163,230,53,0.2)] transition-all shrink-0 disabled:opacity-80 disabled:cursor-wait"
            >
              {isNavigatingProfile ? (
                <Loader2 size={20} className="text-lime-400 animate-spin" />
              ) : (
                <User size={20} className="text-zinc-400 hover:text-lime-400 transition-colors" />
              )}
            </button>
          </div>
        </header>

        {/* --- SIDEBAR --- */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[89]" onClick={() => setSidebarOpen(false)} />}
        <aside className={`fixed top-0 left-0 h-full w-80 bg-[#080B07]/95 backdrop-blur-xl border-r border-white/5 z-[90] transform transition-transform duration-500 ease-out flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
            <span className="font-black text-xl text-white tracking-wide">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="text-zinc-500 hover:text-lime-400 transition-colors"><X size={24} /></button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
            <div>
              <p className="text-xs font-bold text-[#3F523A] uppercase tracking-widest px-4 mb-3">Workspace</p>
              <nav className="space-y-1">
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-lime-400/10 text-lime-400 font-bold transition-colors border border-lime-400/20">
                  <div className="flex items-center gap-3"><History size={20} /> My Collection</div>
                  <span className="bg-lime-400/20 px-2 py-0.5 rounded-md text-xs">{history.length}</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white font-semibold transition-colors">
                  <Bookmark size={20} /> Saved References
                </button>
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-white/5 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-300 font-medium transition-colors">
              <Shield size={18} /> Privacy Policy
            </button>
          <button 
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/80 hover:bg-red-500/10 hover:text-red-500 font-bold transition-colors"
            >
              <LogOut size={18} /> Log Out
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto relative z-10">

          {/* HERO GRID */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">

            {/* Box 1: Selfie (Source Subject) - High Contrast Lime Theme */}
            <div className="group/container bg-[#0D140B] border-2 border-lime-500/20 hover:border-lime-500/50 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(163,230,53,0.15)] hover:shadow-[0_20px_50px_-10px_rgba(163,230,53,0.25)] transition-all duration-500 flex flex-col relative overflow-hidden min-h-[480px]">
              {/* Bold Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-lime-400 to-emerald-600" />

              {/* Structured Header Section */}
              <div className="bg-lime-500/10 px-6 py-5 border-b border-lime-500/10 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 mb-2">
                    <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_#a3e635]" />
                    <span className="text-lime-400 font-mono text-[10px] font-bold tracking-widest uppercase">Input Module</span>
                  </div>
                  <h2 className="text-white font-black text-2xl tracking-tight">Source Subject</h2>
                </div>
                <button
                  onClick={() => setShowGuide(true)}
                  className="w-12 h-12 rounded-2xl bg-[#050704] border border-lime-500/30 text-lime-400 flex items-center justify-center hover:bg-lime-400 hover:text-black transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(163,230,53,0.4)]"
                  title="Capture Guide"
                >
                  <Info size={22} strokeWidth={2.5} />
                </button>
              </div>

              {/* Upload Dropzone Container */}
              <div className="flex-1 p-6 flex flex-col">
                <label className="block cursor-pointer flex-1 relative group/upload">
                  <div className={`w-full h-full rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] bg-[#050704] relative overflow-hidden ${selfieFile ? 'border-lime-500/50 shadow-inner' : 'border-lime-500/30 group-hover/upload:border-lime-400 group-hover/upload:bg-lime-500/5'}`}>
                    {selfieFile ? (
                      <>
                        <img src={selfieFile} alt="Selfie" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/upload:scale-105" />
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-all duration-300 backdrop-blur-sm">
                          <span className="bg-lime-400 text-black font-black uppercase tracking-widest px-6 py-4 rounded-xl flex items-center gap-2 shadow-[0_0_30px_rgba(163,230,53,0.4)] transform translate-y-4 group-hover/upload:translate-y-0 transition-transform"><RefreshCw size={18} strokeWidth={3} /> Change Photo</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-lime-400 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(163,230,53,0.3)] group-hover/upload:scale-110 group-hover/upload:shadow-[0_0_50px_rgba(163,230,53,0.5)] transition-all duration-300">
                          <Camera size={34} className="text-black" strokeWidth={2.5} />
                        </div>
                        <p className="text-white font-black tracking-tight text-xl mb-2">Upload Portrait</p>
                        <p className="text-zinc-400 text-sm font-medium bg-white/5 px-4 py-2 rounded-lg border border-white/10">Click or drag image (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleSelfieUpload} />
                </label>
              </div>
            </div>

            {/* Box 2: Reference (Reference Aesthetic) - High Contrast Amber Theme */}
            <div className="group/container bg-[#161108] border-2 border-amber-500/20 hover:border-amber-500/50 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(251,191,36,0.15)] hover:shadow-[0_20px_50px_-10px_rgba(251,191,36,0.25)] transition-all duration-500 flex flex-col relative overflow-hidden min-h-[480px]">
              {/* Bold Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-600" />

              {/* Structured Header Section */}
              <div className="bg-amber-500/10 px-6 py-5 border-b border-amber-500/10 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
                    <span className="text-amber-400 font-mono text-[10px] font-bold tracking-widest uppercase">Style Vector</span>
                  </div>
                  <h2 className="text-white font-black text-2xl tracking-tight">Reference Blueprint</h2>
                </div>
              </div>

              {/* Interactive Library Selection Area */}
              <div className="flex-1 p-6 flex flex-col">
                <div
                  onClick={() => setShowExplore(true)}
                  className={`flex-1 relative w-full h-full rounded-2xl overflow-hidden border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] bg-[#050704] ${referenceImage ? 'border-amber-500/50 shadow-inner' : 'border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/5'}`}
                >
                  {referenceImage ? (
                    <>
                      <img src={referenceImage.thumb} alt="Style" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050704] via-[#050704]/40 to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                        <div>
                          <p className="text-amber-400 text-xs font-black tracking-widest uppercase mb-2 bg-amber-400/10 inline-block px-3 py-1 rounded-lg border border-amber-400/20">{referenceImage.category}</p>
                          <p className="text-white font-black text-3xl tracking-tight drop-shadow-md">{referenceImage.name}</p>
                        </div>
                        <span className="bg-amber-400 text-black hover:bg-amber-300 p-3 rounded-xl transition-colors shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                          <ChevronRight size={22} strokeWidth={3} />
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-amber-400 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(251,191,36,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(251,191,36,0.5)] transition-all duration-300">
                        <Sparkles size={34} className="text-black" strokeWidth={2.5} />
                      </div>
                      <p className="text-white font-black tracking-tight text-xl mb-2">Select Aesthetic</p>
                      <p className="text-zinc-400 text-sm font-medium bg-white/5 px-4 py-2 rounded-lg border border-white/10">Browse reference gallery</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* ASPECT RATIOS */}
          <div className="bg-[#0A0D08]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 mb-8 shadow-xl">
            <p className="text-zinc-500 text-[11px] font-bold tracking-[0.2em] uppercase mb-4 px-2">Geometry Format</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ASPECT_RATIOS.map(ratio => {
                const Icon = ratio.icon;
                const isActive = selectedRatio.id === ratio.id;
                return (
                  <button key={ratio.id} onClick={() => setSelectedRatio(ratio)}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 ${isActive ? "bg-lime-400/10 border-lime-400/50 text-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.15)] scale-[1.02]" : "bg-black/20 border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300 hover:bg-white/5"
                      }`}>
                    <Icon size={28} strokeWidth={isActive ? 2.5 : 1.5} />
                    <div className="text-center">
                      <p className={`font-mono font-bold text-sm ${isActive ? 'text-lime-400' : 'text-zinc-400'}`}>{ratio.label}</p>
                      <p className="text-[10px] uppercase tracking-wider mt-1 opacity-70">{ratio.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

        {/* GENERATE BUTTON */}
          {(() => {
            const isOutOfTokens = userPlan !== "premium" && tokens <= 0;
            
            return (
              <button 
                onClick={handleGenerate} 
                disabled={!canGenerate || isGenerating || isOutOfTokens}
                className={`w-full py-6 rounded-2xl font-black text-xl tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-3
                  ${isGenerating 
                    ? "bg-white/5 border border-white/5 text-zinc-400 cursor-wait"
                    : isOutOfTokens 
                      ? "bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)] cursor-not-allowed"
                      : canGenerate
                        ? "bg-lime-400 hover:bg-lime-300 text-black shadow-[0_0_50px_rgba(163,230,53,0.25)] hover:shadow-[0_0_70px_rgba(163,230,53,0.4)] hover:-translate-y-1"
                        : "bg-white/5 border border-white/5 text-zinc-600 cursor-not-allowed"
                  }`}
              >
                {isGenerating ? (
                  <>
                    <Sparkles size={24} className="animate-pulse" />
                    Synthesizing...
                  </>
                ) : isOutOfTokens ? (
                  <>Tokens Depleted (Resets in 24h)</>
                ) : (
                  <>
                    <Sparkles size={24} />
                    Initialize Engine
                  </>
                )}
              </button>
            );
          })()}

          {/* --- THE OUTPUT CONTAINER --- */}
          {(isGenerating || outputImage) && (
            <div className="mt-12 bg-[#0A0D08]/90 backdrop-blur-xl border border-lime-500/20 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative animate-in slide-in-from-bottom-8 duration-700">

              <div className="px-6 py-4 border-b border-white/5 bg-black/40 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${isGenerating ? 'bg-amber-400 animate-pulse shadow-[0_0_10px_#fbbf24]' : 'bg-lime-400 shadow-[0_0_10px_#a3e635]'}`} />
                  <span className="text-zinc-300 text-xs font-bold tracking-[0.2em] uppercase font-mono">
                    {isGenerating ? "Engine Active : Processing" : "Task Complete"}
                  </span>
                </div>

                {/* Action Buttons */}
                {outputImage && (
                  <div className="flex items-center gap-3">
                    {/* Generate Next Button */}
                    <button
                      onClick={() => {
                        // 1. Clear the output
                        setOutputImage(null);
                        // 2. Clear the inputs for a fresh start
                        setSelfieFile(null);
                        setReferenceImage(null);
                        // 3. Scroll back to the top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white font-bold text-sm transition-colors border border-white/10"
                    >
                      <RefreshCw size={16} /> Generate Next
                    </button>

                    {/* Download Button */}
                    <a
                      href={outputImage}
                      download="morphgrid-synthesis.jpg"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lime-400/10 text-lime-400 hover:bg-lime-400 hover:text-black font-bold text-sm transition-colors border border-lime-400/20"
                    >
                      <Download size={16} /> Save HD
                    </a>
                  </div>
                )}
              </div>

              {isGenerating ? (
                <div className="p-8 md:p-16 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <div className="relative z-10 w-full max-w-2xl">
                    <div className="flex items-center justify-between mb-12 relative">
                      {/* Source Node */}
                      <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-lime-500/30 shadow-[0_0_30px_rgba(163,230,53,0.1)]">
                        <img src={selfieFile!} alt="Source" className="w-full h-full object-cover filter grayscale contrast-125" />
                        <div className="absolute inset-0 bg-lime-500/10 mix-blend-overlay" />
                        <div className="absolute top-0 left-0 w-full h-[50px] bg-gradient-to-b from-transparent via-lime-400/30 to-transparent animate-scan" />
                        <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-[9px] text-lime-400 font-mono border border-lime-500/30">NODE_01</div>
                      </div>

                      {/* Connection Stream */}
                      <div className="flex-1 h-px bg-white/10 mx-4 relative flex items-center justify-center">
                        <div className="absolute inset-0 data-stream" />
                        <div className="w-14 h-14 rounded-full bg-black border border-lime-500/50 shadow-[0_0_30px_rgba(163,230,53,0.2)] flex items-center justify-center relative z-20">
                          <div className="w-full h-full rounded-full animate-pulse-ring absolute" />
                          <Sparkles className="text-lime-400 animate-pulse" size={24} />
                        </div>
                      </div>

                      {/* Target Node */}
                      <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                        <img src={referenceImage.thumb} alt="Style" className="w-full h-full object-cover filter grayscale contrast-125" />
                        <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />
                        <div className="absolute top-0 left-0 w-full h-[50px] bg-gradient-to-b from-transparent via-amber-400/30 to-transparent animate-scan" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[9px] text-amber-400 font-mono border border-amber-500/30">NODE_02</div>
                      </div>
                    </div>

                    <div className="text-center space-y-4">
                      <div className="font-mono text-lime-400 text-sm md:text-base font-bold tracking-tight h-6 drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]">
                        {">"} {phases[generationPhase]}
                      </div>
                      <div className="h-2 w-full bg-black border border-white/10 rounded-full overflow-hidden relative">
                        <div
                          className="absolute top-0 left-0 h-full bg-lime-400 shadow-[0_0_15px_#A3E635] transition-all duration-200 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-zinc-500 font-mono text-[10px] md:text-xs uppercase tracking-widest">
                        <span>SYS_MEM: ALLOCATED</span>
                        <span className="text-lime-400">{Math.round(progress)}%</span>
                        <span>GPU: ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 md:p-12 relative bg-[radial-gradient(ellipse_at_center,rgba(163,230,53,0.1)_0%,transparent_70%)]">
                  <div className="rounded-2xl overflow-hidden border border-lime-500/30 shadow-[0_0_50px_rgba(163,230,53,0.15)] relative group mx-auto max-w-4xl">
                    <img src={outputImage!} alt="Final Synthesis" className="w-full max-h-[70vh] object-contain bg-black" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <a href={outputImage!} download="morphgrid-synthesis.jpg" className="px-8 py-4 rounded-2xl bg-lime-400 hover:bg-lime-300 text-black font-black uppercase tracking-widest transition-transform hover:scale-105 flex items-center gap-3 shadow-[0_0_30px_rgba(163,230,53,0.4)]">
                        <Download size={20} /> Download Asset
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 bg-[#080B07]/80 backdrop-blur-xl relative z-10 pt-16 pb-8 mt-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">

              {/* Brand Column */}
              <div className="md:col-span-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                    <Layout className="text-black" size={16} strokeWidth={3} />
                  </div>
                  <span className="font-black text-xl tracking-wide text-white">Morph<span className="text-lime-400">Grid</span></span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-8">
                  The premier neural synthesis engine. Transform ordinary portraits into hyper-aesthetic masterpieces using state-of-the-art style transfer and identity preservation.
                </p>
                <div className="flex items-center gap-4">
                  {/* Social/Community Button */}
                  <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-lime-400 hover:border-lime-500/30 hover:bg-lime-500/5 transition-all">
                    <Globe size={18} />
                  </button>
                  {/* Developer/Code Button */}
                  <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-lime-400 hover:border-lime-500/30 hover:bg-lime-500/5 transition-all">
                    <Terminal size={18} />
                  </button>
                  {/* Support/Discord Button */}
                  <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-lime-400 hover:border-lime-500/30 hover:bg-lime-500/5 transition-all">
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>

              {/* Links Column 1: Application */}
              <div className="md:col-span-3 md:col-start-7">
                <p className="text-white font-bold text-sm tracking-widest uppercase mb-6 font-mono">Platform</p>
                <ul className="space-y-4">
                  <li><a href="#" className="text-zinc-500 hover:text-lime-400 text-sm font-medium transition-colors">Generate Avatar</a></li>
                  <li><a href="#" className="text-zinc-500 hover:text-lime-400 text-sm font-medium transition-colors">Style Reference Library</a></li>
                  <li><a href="#" className="text-zinc-500 hover:text-lime-400 text-sm font-medium transition-colors">My Collection</a></li>
                  <li><a href="#" className="text-zinc-500 hover:text-lime-400 text-sm font-medium transition-colors flex items-center gap-2">Token Pricing <span className="bg-lime-500/10 text-lime-400 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-lime-500/20">Pro</span></a></li>
                </ul>
              </div>

              {/* Links Column 2: Legal & Support */}
              <div className="md:col-span-3">
                <p className="text-white font-bold text-sm tracking-widest uppercase mb-6 font-mono">Resources</p>
                <ul className="space-y-4">
                  <li><a href="#" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors">Help & Documentation</a></li>
                  <li><a href="#" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors">API Access</a></li>
                  <li><a href="#" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-zinc-600 text-xs font-mono">
                © {new Date().getFullYear()} MorphGrid Inc. All rights reserved.
              </p>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <Circle size={10} className="text-lime-400 fill-lime-400 animate-pulse" />
                <span className="text-zinc-400 text-xs font-mono font-bold tracking-widest uppercase">All Systems Operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {showGuide && <SelfieGuideModal onClose={() => setShowGuide(false)} />}
      {showExplore && <ExploreModal onSelect={(img) => setReferenceImage(img)} onClose={() => setShowExplore(false)} />}
    {showLogoutModal && (
        <LogoutConfirmModal 
          onClose={() => setShowLogoutModal(false)} 
          onConfirm={handleLogout} 
        />
      )}
    </>
  );
}