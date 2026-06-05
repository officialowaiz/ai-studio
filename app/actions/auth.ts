"use server";

import { createClient } from "@/utils/supabase/server";

// 1. Send the OTP to the user's email
export async function sendOtp(email: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, 
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

// 2. Verify the OTP and check their onboarding status
export async function verifyOtpAndCheckProfile(email: string, otp: string) {
  try {
    const supabase = await createClient();

    // Sanitize the OTP: Removes any spaces, dashes, or letters
    const cleanOtp = otp.replace(/\D/g, '');

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: cleanOtp,
      type: 'email',
    });

    if (error) return { success: false, error: error.message };
    if (!data.user) return { success: false, error: "Session creation failed." };

    // Use maybeSingle() instead of single() to prevent crashes if the trigger is slightly delayed
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', data.user.id)
      .maybeSingle();

    return { 
      success: true, 
      userId: data.user.id,
      onboardingComplete: profile?.onboarding_completed || false 
    };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

// 3. Update the profile and mark onboarding as complete
export async function completeOnboarding(
  userId: string, 
  data: { fullName: string; role: string; terms: boolean }
) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.fullName,
        role: data.role,
        agreed_to_terms: data.terms,
        onboarding_completed: true,
      })
      .eq('id', userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

// 4. Initiate Google OAuth Login
export async function signInWithGoogle() {
  try {
    const supabase = await createClient();
    
    // This tells Google where to send the user after they log in.
    // In production, you will change this to https://upmocks.com/auth/callback
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (error) return { success: false, error: error.message };
    
    // Return the Google URL so our frontend can redirect the user
    return { success: true, url: data.url };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to initialize Google login." };
  }
}