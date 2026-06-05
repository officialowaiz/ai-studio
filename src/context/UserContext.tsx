"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client"; 

// 1. Define the shape of our database profile
type Profile = {
  id: string;
  full_name: string;
  plan_type: "free" | "pro" | "premium";
  token_balance: number;
  total_generations?: number;
};

type UserContextType = {
  profile: Profile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>; // We will call this after an image is generated to update the tokens
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

 // 2. The master fetch function
  const fetchProfile = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // SAFETY PROTOCOL: Ask the database to check the 24h clock and refill if needed
      await supabase.rpc('refill_free_tokens');

      // Now fetch the fresh profile (which will include the new tokens if they just reset)
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, plan_type, token_balance")
        .eq("id", session.user.id)
        .single();
        
      if (data) setProfile(data as Profile);
    } else {
      setProfile(null);
    }
    setIsLoading(false);
  };

  // 3. Run on load and listen for log in/out events
  useEffect(() => {
    fetchProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ profile, isLoading, refreshProfile: fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
}

// 4. Custom hook so any page can easily grab the data
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};