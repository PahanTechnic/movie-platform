/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies as nextCookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await nextCookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Ignore cookie errors in server components
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Ignore cookie errors in server components
          }
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // ✅ Only redirect if NOT on login page
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      <aside className="w-64 bg-[#020617] border-r border-gray-800 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-white">
          Admin Panel
        </h1>

        <nav className="space-y-2 flex-1">
          <a
            href="/admin/dashboard"
            className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </a>

          <a
            href="/admin/movies"
            className="block px-4 py-2 text-gray-400 hover:bg-gray-800 rounded transition-colors"
          >
            Movies
          </a>
        </nav>

        <div className="pt-6 mt-auto border-t border-gray-800">
          <div className="text-gray-400 text-sm truncate mb-3">
            {session.user.email}
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
