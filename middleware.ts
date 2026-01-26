/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ✅ Skip middleware for login page completely
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

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
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
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
    const loginUrl = new URL('/admin/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

// ✅ Match all /admin routes except /admin/login
export const config = {
  matcher: [
    '/admin',
    '/admin/dashboard/:path*',
    '/admin/movies/:path*',
  ],
}
