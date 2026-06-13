"use client";

import React, { useState, Suspense, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import SearchParamsHandler from "./SearchParamsHandler";
import Link from "next/link";
import { sendOtp, verifyOtpAndCheckProfile, completeOnboarding } from "@/app/actions/auth";
import { useRouter } from "next/navigation"; // Removed useSearchParams from here!

import {
  ArrowRight, Mail, ShieldCheck, Zap, ArrowLeft,
  User, Briefcase, GraduationCap, Building2, CheckSquare
} from "lucide-react";

// Tells Next.js not to statically render this page
export const dynamic = "force-dynamic";

type AuthStep = "initial" | "otp" | "name" | "role" | "terms";
type UserRole = "student" | "professional" | "business" | "other" | null;

export default function AdvancedAuthPage() {
  const router = useRouter();

  // 1. STATE MUST BE DEFINED FIRST
  const [authStep, setAuthStep] = useState<AuthStep>("initial");
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Form Data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // 2. NOW WE CAN USE THE HANDLER (Because state is defined above)
  const handleParams = useCallback((step: string | null, incomingUserId: string | null, incomingEmail: string | null) => {
    if (step === 'name' && incomingUserId) {
      setUserId(incomingUserId);
      if (incomingEmail) setEmail(incomingEmail);
      setAuthStep('name');
      setIsProcessing(false);
    }
  }, []); // Empty dependency array is correct here

  // 3. GOOGLE LOGIN HANDLER
  // 3. GOOGLE LOGIN HANDLER (Client-Side)
  const handleGoogleLogin = async () => {
    setIsProcessing(true);
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      alert("Supabase environment variables are not configured.");
      setIsProcessing(false);
      return;
    }

    // Initialize the Supabase client directly in the browser
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Trigger the OAuth login directly from the frontend
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Use your live explicit redirect URL
        redirectTo: 'https://promptno.vercel.app/auth/callback', 
      },
    });

    // NOTE: If successful, Supabase automatically redirects the browser to Google!
    // We only need to handle the error state.
    if (error) {
      alert("Failed to connect to Google: " + error.message);
      setIsProcessing(false);
    }
  };

  // --- FORM SUBMISSION HANDLERS ---
  
  // 1. Initial Email Submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsProcessing(true);
    const response = await sendOtp(email);
    setIsProcessing(false);

    if (response.success) {
      setAuthStep("otp");
    } else {
      alert("Failed to send code: " + response.error);
    }
  };

  // 2. OTP Verification
  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const response = await verifyOtpAndCheckProfile(email, otp);
    setIsProcessing(false);

    if (response.success) {
      setUserId(response.userId!);

      if (response.onboardingComplete) {
        router.push("/dashboard");
      } else {
        setAuthStep("name");
      }
    } else {
      alert("Verification failed: " + response.error);
    }
  };

  // 3. Name Submission (Remains unchanged)
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim()) setAuthStep("role");
  };

  // 4. Role Submission (Remains unchanged)
  const handleRoleSubmit = () => {
    if (selectedRole) setAuthStep("terms");
  };

  // 5. Final Onboarding & Redirect
  const handleFinalSubmit = async () => {
    if (agreedToTerms && userId) {
      setIsProcessing(true);

      const response = await completeOnboarding(userId, {
        fullName,
        role: selectedRole as string,
        terms: agreedToTerms
      });

      setIsProcessing(false);

      if (response.success) {
        router.push("/pricing");
      } else {
        alert("Failed to create profile: " + response.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050704] text-gray-200 font-sans flex">

      {/* 4. Add the Suspense boundary somewhere in your JSX (top level is fine) */}
      <Suspense fallback={null}>
        <SearchParamsHandler onParams={handleParams} />
      </Suspense>

      {/* --- INJECTED CSS FOR ADVANCED ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .pulse-circle::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid #A3E635;
          animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
      `}} />

      {/* ========================================== */}
      {/* LEFT COLUMN: AUTHENTICATION (40% WIDTH)    */}
      {/* ========================================== */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-16 lg:px-20 relative z-10 py-12 overflow-y-auto">

        {/* Back Button */}
        <button
          onClick={() => authStep === "initial" ? router.push('/') : setAuthStep("initial")}
          className="absolute top-8 left-8 flex items-center space-x-2 text-gray-500 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold tracking-widest uppercase">
            {authStep === "initial" ? "Home" : "Restart"}
          </span>
        </button>

        <div className="max-w-md w-full mx-auto">
          {/* Brand Header */}
          <div className="mb-10">
            <div className="h-10 w-10 rounded-xl bg-[#A3E635] flex items-center justify-center font-black text-black text-xl shadow-[0_0_20px_rgba(163,230,53,0.3)] mb-6">
              ∑
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {authStep === "initial" && "Welcome to UpMocks"}
              {authStep === "otp" && "Verify Identity"}
              {authStep === "name" && "Create Profile"}
              {authStep === "role" && "Your Expertise"}
              {authStep === "terms" && "Final Step"}
            </h1>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              {authStep === "initial" && "Enter your credentials or bypass securely with Google to access the network."}
              {authStep === "otp" && `A secure sequence has been sent to ${email}.`}
              {authStep === "name" && "Let's personalize your networking experience."}
              {authStep === "role" && "How will you be using the platform?"}
              {authStep === "terms" && "Review our network guidelines to continue."}
            </p>
          </div>

          {/* Dynamic Form Area based on State */}
          <div className="space-y-6">

            {/* STATE 1: INITIAL EMAIL / GOOGLE */}
            {authStep === "initial" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isProcessing}
                  type="button"
                  className="w-full bg-[#1E291B]/40 border border-[#3F523A] text-white font-bold py-3.5 rounded-xl hover:bg-[#1E291B]/80 hover:border-[#A3E635]/50 transition-all flex items-center justify-center space-x-3 group mb-6"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center mb-6">
                  <div className="flex-grow border-t border-[#3F523A]/50"></div>
                  <span className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Or standard entry</span>
                  <div className="flex-grow border-t border-[#3F523A]/50"></div>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@example.com"
                      className="w-full bg-[#0A0D08] border border-[#3F523A] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] transition-all"
                    />
                  </div>
                  <button
                    disabled={isProcessing || !email}
                    className="w-full bg-white text-black font-extrabold tracking-wide py-3.5 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span>{isProcessing ? "Scanning Database..." : "Continue"}</span>
                    {!isProcessing && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>
              </div>
            )}

            {/* STATE 2: OTP VERIFICATION */}
            {authStep === "otp" && (
              <form onSubmit={handleOtpVerification} className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Secure Code</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="0 0 0 0 0 0 0 0"
                    className="w-full text-center tracking-[1em] font-mono text-xl bg-[#0A0D08] border border-[#3F523A] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#A3E635] transition-all"
                  />
                </div>
                <button
                  disabled={isProcessing || otp.length < 6}
                  className="w-full bg-[#A3E635] text-black font-extrabold tracking-wide py-3.5 rounded-xl hover:bg-[#86c920] transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)] disabled:opacity-50"
                >
                  {isProcessing ? "Authenticating..." : "Authenticate Identity"}
                </button>
                <button type="button" onClick={() => setAuthStep("initial")} className="w-full text-xs text-gray-500 hover:text-white transition-colors">
                  ← Use a different email
                </button>
              </form>
            )}

            {/* STATE 3: NEW USER - NAME */}
            {authStep === "name" && (
              <form onSubmit={handleNameSubmit} className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Registered Email</label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full bg-[#1E291B]/30 border border-[#3F523A]/50 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-[#0A0D08] border border-[#3F523A] rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#A3E635] transition-all"
                    />
                  </div>
                </div>
                <button
                  disabled={!fullName.trim()}
                  className="w-full bg-white text-black font-extrabold tracking-wide py-3.5 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] mt-2 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STATE 4: NEW USER - ROLE SELECTION */}
            {authStep === "role" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "student", label: "Student", icon: GraduationCap },
                    { id: "professional", label: "Professional", icon: Briefcase },
                    { id: "business", label: "Business Owner", icon: Building2 },
                    { id: "other", label: "Other", icon: User },
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id as UserRole)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${selectedRole === role.id
                        ? "bg-[#1E291B] border-[#A3E635] text-[#A3E635]"
                        : "bg-[#0A0D08] border-[#3F523A] text-gray-400 hover:border-gray-500 hover:text-gray-300"
                        }`}
                    >
                      <role.icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-bold">{role.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleRoleSubmit}
                  disabled={!selectedRole}
                  className="w-full bg-white text-black font-extrabold tracking-wide py-3.5 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STATE 5: NEW USER - TERMS & CONDITIONS */}
            {authStep === "terms" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
                <div className="bg-[#1E291B]/30 border border-[#3F523A]/50 rounded-xl p-4 text-sm text-gray-400 h-40 overflow-y-auto custom-scrollbar">
                  <p className="mb-2"><strong className="text-white">1. Acceptance of Terms:</strong> By accessing and using our platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
                  <p className="mb-2"><strong className="text-white">2. Privacy Policy:</strong> Your data is secured and encrypted. We do not share your matrix blueprints with unauthorized third-party entities.</p>
                  <p className="mb-2"><strong className="text-white">3. User Conduct:</strong> You agree to use the network for lawful academic and professional networking purposes only.</p>
                </div>

                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-[#3F523A] rounded flex items-center justify-center peer-checked:bg-[#A3E635] peer-checked:border-[#A3E635] transition-all">
                      <CheckSquare className="w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    I agree to the Terms of Service, Privacy Policy, and Data Processing Agreement.
                  </span>
                </label>

                <button
                  onClick={handleFinalSubmit}
                  disabled={!agreedToTerms || isProcessing}
                  className="w-full bg-[#A3E635] text-black font-extrabold tracking-wide py-3.5 rounded-xl hover:bg-[#86c920] transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)] disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isProcessing ? "Deploying Profile..." : "Complete Registration"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT COLUMN: SHOWCASE ANIMATION (60% W)   */}
      {/* ========================================== */}
      <div className="hidden lg:flex w-[60%] bg-[#0A0D08] items-center justify-center p-8 relative overflow-hidden border-l border-[#1E291B]">

        {/* Background Mesh Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A3E635]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#A3E635]/10 rounded-full blur-[120px]" />

        {/* Central Square Video/Ad Container */}
        <div className="w-full max-w-2xl aspect-square relative rounded-[40px] border border-[#3F523A]/40 bg-[#1E291B]/20 backdrop-blur-3xl overflow-hidden shadow-2xl flex items-center justify-center animate-float">

          {/* Laser Scanning Line */}
          <div className="absolute left-0 right-0 h-0.5 bg-[#A3E635] shadow-[0_0_20px_#A3E635] animate-scan z-20" />

          {/* Grid Background Pattern inside the Square */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#3F523A 1px, transparent 1px), linear-gradient(90deg, #3F523A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Advanced Visual Mockup */}
          <div className="relative z-10 flex flex-col items-center">

            {/* Glowing Core */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-8">
              <div className="absolute inset-0 bg-[#A3E635] rounded-full blur-[40px] opacity-30" />
              <div className="w-16 h-16 bg-[#050704] border-2 border-[#A3E635] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(163,230,53,0.5)] z-10 pulse-circle relative">
                <Zap className="text-[#A3E635] w-6 h-6" />
              </div>

              {/* Orbital Rings */}
              <div className="absolute w-48 h-48 border border-[#3F523A] rounded-full" />
              <div className="absolute w-64 h-64 border border-[#3F523A]/50 rounded-full border-dashed" />
            </div>

            {/* Floating Info Cards */}
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center space-x-2 bg-[#050704]/80 border border-[#3F523A] px-4 py-2 rounded-full shadow-lg">
                <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">End-to-End Encryption</span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight mt-4">
                Secure Identity Mapping
              </h2>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">
                Your credentials never leave our secure isolation chambers.
              </p>
            </div>
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#A3E635]/50" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#A3E635]/50" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#A3E635]/50" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#A3E635]/50" />

        </div>
      </div>

    </div>
  );
}