/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ✅ COMPLETELY SKIP middleware for login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Only run auth check for OTHER admin routes
  // eslint-disable-next-line prefer-const
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 🔐 If no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return res
}

// ✅ FIXED: Match all /admin routes except /admin/login
export const config = {
  matcher: [
    '/admin/dashboard',
    '/admin/dashboard/:path*',
    '/admin/movies',
    '/admin/movies/:path*'
  ]
}