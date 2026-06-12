import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';


export async function POST(request: Request) {
  try {
    const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    // 1. Validation: Ensure we actually have a job ID before querying the database
    if (!jobId) {
      console.error("Webhook received without a jobId");
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const body = await request.json();

    // Log the incoming body in your Vercel/Next.js console so you can see exactly what WaveSpeed sends
    console.log(`Webhook received for Job ID ${jobId}:`, JSON.stringify(body));

    // --- THE RECURSIVE URL CRAWLER ---
    const allUrls: string[] = [];
    
    // This safely digs through the JSON and extracts clean strings
    const extractUrls = (obj: any) => {
      if (!obj) return;
      for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'string' && value.startsWith('http')) {
          allUrls.push(value);
        } else if (typeof value === 'object') {
          extractUrls(value);
        }
      }
    };
    
    extractUrls(body);

    // Filter out input images (Supabase/Unsplash) AND internal API endpoint links
    const targetUrls = allUrls.filter(url => 
      !url.includes('supabase') && 
      !url.includes('unsplash') &&
      !url.includes('/predictions/') // Filters out WaveSpeed's non-image API endpoints
    );

    // Try to find a link that explicitly ends in an image extension
    let outputUrl = targetUrls.find(url => url.match(/\.(jpeg|jpg|png|webp)/i));

    // If no explicit extension is found, safely fallback to the last valid URL
    if (!outputUrl && targetUrls.length > 0) {
      outputUrl = targetUrls[targetUrls.length - 1];
    }

    // Check if the word "failed" appears in their status messages
    const failed = body?.status === 'failed' || body?.data?.status === 'failed';
    // ------------------------------------

    // 2. Update the job in Supabase — this triggers Realtime on the frontend
    const { error: dbError } = await supabase
      .from('generation_jobs')
      .update({
        status: failed ? 'failed' : 'completed',
        output_url: outputUrl || null,
      })
      .eq('id', jobId);

    if (dbError) {
      throw new Error(`Failed to update database: ${dbError.message}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("❌ Webhook processing error:", error.message);
    return NextResponse.json(
      { error: "Internal Webhook Error" }, 
      { status: 500 }
    );
  }
}