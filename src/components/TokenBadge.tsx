"use client";

/**
 * TokenBadge — Drop-in replacement for the token counter in the dashboard header.
 *
 * Props:
 *  - tokens:    number   (current remaining tokens)
 *  - plan:      "free" | "pro" | "premium"
 *  - onUpgrade: () => void   (called when + is clicked; navigate to /pricing)
 *
 * Usage in dashboard header:
 *   <TokenBadge tokens={tokens} plan={userPlan} onUpgrade={() => router.push('/pricing')} />
 */

import React from "react";
import { Zap, Plus, Crown, Sparkles } from "lucide-react";

type Plan = "free" | "pro" | "premium";

interface TokenBadgeProps {
  tokens: number;
  plan: Plan;
  onUpgrade: () => void;
}

const PLAN_CONFIG: Record<Plan, {
  label: string;
  labelClass: string;
  zapClass: string;
  dotClass: string;
  plusBtnClass: string;
  badgeRing: string;
  icon: React.ReactNode;
  dailyCap: number | null;
}> = {
  free: {
    label: "FREE",
    labelClass: "text-zinc-500",
    zapClass: "text-zinc-400",
    dotClass: "bg-zinc-600",
    plusBtnClass: "bg-zinc-700 hover:bg-zinc-600 text-white shadow-none",
    badgeRing: "border-zinc-800 hover:border-zinc-600",
    icon: null,
    dailyCap: 3,
  },
  pro: {
    label: "PRO",
    labelClass: "text-lime-400",
    zapClass: "text-lime-400 fill-lime-400/20",
    dotClass: "bg-lime-400",
    plusBtnClass: "bg-lime-400 hover:bg-lime-300 text-black shadow-[0_0_10px_rgba(163,230,53,0.4)] hover:shadow-[0_0_18px_rgba(163,230,53,0.6)]",
    badgeRing: "border-lime-500/30 hover:border-lime-500/60 shadow-[0_0_15px_rgba(163,230,53,0.05)] hover:shadow-[0_0_20px_rgba(163,230,53,0.15)]",
    icon: <Sparkles size={9} className="text-lime-400" />,
    dailyCap: null,
  },
  premium: {
    label: "PREMIUM",
    labelClass: "text-amber-400",
    zapClass: "text-amber-400 fill-amber-400/20",
    dotClass: "bg-amber-400",
    plusBtnClass: "bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_10px_rgba(251,191,36,0.4)] hover:shadow-[0_0_18px_rgba(251,191,36,0.6)]",
    badgeRing: "border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_15px_rgba(251,191,36,0.05)] hover:shadow-[0_0_20px_rgba(251,191,36,0.12)]",
    icon: <Crown size={9} className="text-amber-400 fill-amber-400/40" />,
    dailyCap: null,
  },
};

export default function TokenBadge({ tokens, plan, onUpgrade }: TokenBadgeProps) {
  const cfg = PLAN_CONFIG[plan];
  const isUnlimited = plan === "premium";

  return (
    <div
      className={`
        flex items-center bg-[#0A0D08] border rounded-full p-1 pl-3
        transition-all duration-300 cursor-default
        ${cfg.badgeRing}
      `}
    >
      {/* Left: zap icon + token count */}
      <div className="flex items-center gap-2 mr-2.5">
        <Zap size={13} className={cfg.zapClass} />

        <div className="flex flex-col items-start leading-none">
          {/* Token number or ∞ */}
          <span className="font-mono text-sm font-bold text-white tracking-tight">
            {isUnlimited ? "∞" : tokens}
          </span>

          {/* Plan mini-tag */}
          <div className="flex items-center gap-0.5 mt-0.5">
            {cfg.icon && cfg.icon}
            <span className={`font-mono text-[8px] font-black uppercase tracking-[0.12em] ${cfg.labelClass}`}>
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Token label — hidden on small screens */}
        <span className="font-mono text-[10px] font-bold text-zinc-600 uppercase tracking-widest hidden sm:inline-block ml-1">
          Tokens
        </span>
      </div>

      {/* Right: + button → navigates to /pricing */}
      <button
        onClick={onUpgrade}
        title={plan === "free" ? "Upgrade for more tokens" : "Manage plan"}
        className={`
          rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95
          ${cfg.plusBtnClass}
        `}
      >
        <Plus size={14} strokeWidth={3} />
      </button>
    </div>
  );
}

/**
 * ─────────────────────────────────────────────────────────────────
 * HOW TO WIRE THIS INTO YOUR DASHBOARD (page.tsx)
 * ─────────────────────────────────────────────────────────────────
 *
 * 1. Import at the top of your dashboard page.tsx:
 *      import TokenBadge from "@/components/TokenBadge";
 *
 * 2. Add state for tokens and plan (or fetch from Supabase profile):
 *      const [tokens, setTokens] = useState(3);
 *      const [userPlan, setUserPlan] = useState<"free"|"pro"|"premium">("free");
 *
 * 3. Replace the existing credit badge JSX block in the header with:
 *      <TokenBadge
 *        tokens={tokens}
 *        plan={userPlan}
 *        onUpgrade={() => router.push('/pricing')}
 *      />
 *
 * 4. After image generation, decrement tokens:
 *      setTokens(prev => Math.max(0, prev - 1));
 *
 * 5. On sign-in callback (route.ts / auth), read plan from the
 *    'profiles' table and pass it down (or via a React context).
 * ─────────────────────────────────────────────────────────────────
 */