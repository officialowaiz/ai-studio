import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We can lower the maxDuration because the function no longer waits 60+ seconds for the image!
export const maxDuration = 30; 

// Initialize Supabase client with the Service Role Key to bypass RLS for server-side inserts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(request: Request) {
  try {
    console.log("=== STARTING ASYNC FACE SWAP JOB ===");
    const body = await request.json();
    const { sourceImage, styleReference, userId } = body;

    // Safety check from your old code
    if (!process.env.WAVESPEED_API_KEY) {
      throw new Error("WAVESPEED_API_KEY missing from .env.local!");
    }
    if (!userId) {
      throw new Error("User ID is required to create a job.");
    }

    // STEP 1: Create a pending job record in Supabase
    console.log("1. Creating job in database...");
    const { data: job, error: dbError } = await supabase
      .from('generation_jobs')
      .insert({ user_id: userId, status: 'pending' })
      .select()
      .single();

    if (dbError || !job) {
      throw new Error(`Database error: ${dbError?.message}`);
    }

    // STEP 2: Submit to WaveSpeed with the Webhook URL
    console.log("2. Submitting to WaveSpeedAI with webhook...");
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook?jobId=${job.id}`;

    console.log("🚨 EXACT WEBHOOK URL BEING SENT:", webhookUrl);

  // CORRECT — webhook goes in the URL as a query param:
const apiUrl = `https://api.wavespeed.ai/api/v3/wavespeed-ai/image-face-swap-pro?webhook=${encodeURIComponent(webhookUrl)}`;

const submitRes = await fetch(apiUrl, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.WAVESPEED_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    image: styleReference,
    face_image: sourceImage,
    output_format: "jpeg",
    enable_base64_output: false,
    enable_sync_mode: false,
    // no webhook field here anymore
  }),
});

    if (!submitRes.ok) {
      const err = await submitRes.text();
      // If WaveSpeed rejects the job, update the database to show it failed
      await supabase.from('generation_jobs').update({ status: 'failed' }).eq('id', job.id);
      throw new Error(`WaveSpeed submit error ${submitRes.status}: ${err}`);
    }

    // STEP 3: Return the jobId immediately. No more polling!
    console.log("3. Job submitted successfully. ID:", job.id);
    return NextResponse.json({ jobId: job.id });

  } catch (error: any) {
    console.error("\n❌ FATAL BACKEND ERROR:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}