import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 1. Initialize Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Fetch the user session securely
  const { data: { user } } = await supabase.auth.getUser()
  const currentPath = request.nextUrl.pathname;

  // ---------------------------------------------------------
  // 3. ROUTE CONFIGURATION
  // Add new folder names to these arrays as your app grows
  // ---------------------------------------------------------
  
  const protectedRoutes = ['/dashboard', '/profile'];
  const authRoutes = ['/sign-in'];

  // Check if the current path matches any in our arrays
  const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
  const isAuthRoute = authRoutes.some(route => currentPath.startsWith(route));

  // ---------------------------------------------------------
  // 4. THE BOUNCER LOGIC
  // ---------------------------------------------------------

  // KICKOUT RULE 1: Logged OUT user trying to access a Protected page
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  // KICKOUT RULE 2: Logged IN user trying to access the Sign-In page
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Allow everyone else (Landing page, Pricing page, etc.) to pass normally
  return supabaseResponse
}

// 5. Next.js Config (Ignore static files)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}