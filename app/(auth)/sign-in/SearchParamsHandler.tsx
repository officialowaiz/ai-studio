"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

// This component doesn't render anything; it just runs side effects
export default function SearchParamsHandler({ 
  onParams 
}: { 
  onParams: (step: string | null, userId: string | null, email: string | null) => void 
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const step = searchParams.get('step');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    
    onParams(step, userId, email);
  }, [searchParams, onParams]);

  return null;
}