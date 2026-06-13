import { NextResponse } from 'next/server';
// ✅ THE FIX: Import YOUR configured Next.js server client, not the raw supabase-js client
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  // Default to sending the user to the dashboard
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    // ✅ This configured client automatically creates and sets the secure browser cookies!
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect the user to the dashboard with their shiny new login cookies
  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}