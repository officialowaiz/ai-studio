import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()

        // Exchange the code for a secure user session cookie
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Check if they have finished their UpMocks onboarding
            const { data: profile } = await supabase
                .from('profiles')
                .select('onboarding_completed')
                .eq('id', data.user.id)
                .maybeSingle();

            if (profile?.onboarding_completed) {
                return NextResponse.redirect(`${origin}/dashboard`)
            } else {
                const email = data.user.email;
                return NextResponse.redirect(`${origin}/sign-in?step=name&userId=${data.user.id}&email=${encodeURIComponent(email ?? '')}`)
            }
        }
    }

    // If something goes wrong, send them back to the start
    return NextResponse.redirect(`${origin}/sign-in?error=auth-failed`)
}