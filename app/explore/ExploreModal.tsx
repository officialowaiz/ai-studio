"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";

export const REFERENCE_IMAGES = [
  { 
    id: "r1", 
    name: "Cyberpunk Neon", 
    category: "Sci-Fi", 
    thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop", 
    prompt: "Cyberpunk neon portrait, electric blue and magenta lighting, high tech aesthetic, photorealistic 8k, rain reflections on face, dramatic shadows, futuristic city background, cinematic close-up portrait"
  },
  { 
    id: "r2", 
    name: "Renaissance Oil", 
    category: "Classic", 
    thumb: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400&auto=format&fit=crop", 
    prompt: "Classical renaissance oil painting portrait, dramatic chiaroscuro lighting, museum quality, fine brush strokes, old master technique, rich warm tones, painted portrait on canvas"
  },
  { 
    id: "r3", 
    name: "Cosmic Void", 
    category: "Abstract", 
    thumb: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=400&auto=format&fit=crop", 
    prompt: "Deep space cosmic portrait, nebula colors swirling around face, stars in background, ethereal glow, otherworldly beauty, digital art 8k, face illuminated by galaxy light"
  },
  { 
    id: "r4", 
    name: "Gold Baroque", 
    category: "Classic", 
    thumb: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop", 
    prompt: "Baroque golden portrait, ornate gilded background, Rembrandt lighting, deep dramatic shadows, luxurious rich fabrics, oil painting texture, warm amber tones, museum quality fine art portrait"
  },
  { 
    id: "r5", 
    name: "Neon Samurai", 
    category: "Anime", 
    thumb: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=400&auto=format&fit=crop", 
    prompt: "Futuristic neon samurai portrait, Japanese aesthetic, cherry blossoms in background, pink and purple neon lights on face, anime inspired style, dramatic warrior pose, close-up portrait"
  },
  { 
    id: "r6", 
    name: "Holographic Soul", 
    category: "Sci-Fi", 
    thumb: "https://images.unsplash.com/photo-1519120944692-1a8d8cfc107f?q=80&w=400&auto=format&fit=crop", 
    prompt: "Holographic translucent portrait, prismatic light refraction across face, futuristic digital effect, iridescent rainbow colors, glowing edges, 8k ultra detailed render, sci-fi aesthetic"
  },
  { 
    id: "r7", 
    name: "Neon Drifter", 
    category: "Sci-Fi", 
    thumb: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=400&auto=format&fit=crop", 
    prompt: "Cinematic cyberpunk portrait, glowing neon street lights reflecting on face, moody synthwave aesthetic, pink and blue neon rim lighting, urban night background, 8k resolution, highly detailed photography"
  },
  { 
    id: "r8", 
    name: "Dark Academia", 
    category: "Classic", 
    thumb: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop", 
    prompt: "Dark academia portrait, classic tailored vintage suit, moody library background with warm candlelight, intellectual aesthetic, sharp editorial portrait, muted earth tones, 8k photography"
  },
  { 
    id: "r9", 
    name: "Nordic Warrior", 
    category: "Fantasy", 
    thumb: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=400&auto=format&fit=crop", 
    prompt: "Epic nordic warrior portrait, rugged battle-worn aesthetic, thick fur collar armor, dramatic cinematic rim lighting, stormy sky background, fantasy RPG style, intense powerful gaze, unreal engine 5 render, highly detailed"
  },
  { 
    id: "r10", 
    name: "Vintage Casual", 
    category: "Classic", 
    thumb: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=400&auto=format&fit=crop", 
    prompt: "Vintage casual portrait, relaxed smile, warm natural lighting, beige neutral background, casual stylish clothing, happy and relaxed expression, soft film photography aesthetic, 35mm film grain"
  },
  { 
    id: "r11", 
    name: "Solarpunk", 
    category: "Sci-Fi", 
    thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop", 
    prompt: "Solarpunk portrait, lush green nature merged with futuristic technology, golden sunlight, flowers and plants integrated into clothing, bright optimistic color palette, utopian aesthetic, 8k photorealistic"
  },
  { 
    id: "r12", 
    name: "Ink Sketch", 
    category: "Abstract", 
    thumb: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=400&auto=format&fit=crop", 
    prompt: "Detailed ink sketch portrait, fine pen line art, crosshatching shading technique, high contrast black and white, artbook quality illustration, detailed facial features drawn in ink"
  },
];

const CATEGORIES = ["All", "Sci-Fi", "Classic", "Abstract", "Anime", "Fantasy", "Retro"];

export default function ExploreModal({ onSelect, onClose }: { onSelect: (img: any) => void, onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? REFERENCE_IMAGES : REFERENCE_IMAGES.filter(r => r.category === activeCategory);

  return (
    <div className="fixed inset-0 bg-[#050704]/95 z-[998] flex flex-col backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="px-8 py-6 border-b border-lime-500/10 flex items-center justify-between bg-black/40">
        <div>
          <h2 className="text-white font-black text-3xl font-space tracking-tight">Reference Library</h2>
          <p className="text-zinc-400 text-sm mt-1">Select the aesthetic blueprint for your transformation</p>
        </div>
        <button onClick={onClose} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-lime-400 text-white text-sm font-semibold transition-all">
          <X size={16} /> Close Library
        </button>
      </div>

      <div className="px-8 py-4 border-b border-lime-500/5 flex gap-3 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat ? "bg-lime-400 text-black shadow-[0_0_20px_rgba(163,230,53,0.3)]" : "bg-transparent border-[#2A3A25] border text-zinc-500 hover:border-lime-400/50 hover:text-zinc-300"
              }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filtered.map(ref => (
            <div key={ref.id} onClick={() => { onSelect(ref); onClose(); }} className="group relative rounded-2xl overflow-hidden cursor-pointer border border-[#1E291B] hover:border-lime-400 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(163,230,53,0.2)] bg-[#0A0D08]">
              <div className="aspect-square overflow-hidden relative">
                <img src={ref.thumb} alt={ref.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-lime-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-lime-500/20 uppercase tracking-widest">
                  {ref.category}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-extrabold text-lg font-space leading-tight">{ref.name}</p>
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                  <Sparkles size={14} className="text-lime-400" />
                  <span className="text-lime-400 text-xs font-bold uppercase tracking-wider">Apply Style</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}