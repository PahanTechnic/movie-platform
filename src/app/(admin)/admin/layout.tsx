/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from 'next/navigation'
import { cookies as nextCookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ✅ Next.js 15 requires await
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
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      <aside className="w-64 bg-[#020617] border-r border-gray-800 p-6 relative">
        <h1 className="text-2xl font-bold mb-8 text-white">
          Admin Panel
        </h1>

        <nav className="space-y-2">
          <a
            href="/admin/dashboard"
            className="block px-4 py-2 bg-blue-600 text-white rounded"
          >
            Dashboard
          </a>

          <a
            href="/admin/movies"
            className="block px-4 py-2 text-gray-400 hover:bg-gray-800 rounded"
          >
            Movies
          </a>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 text-gray-400 text-sm truncate">
          {session.user.email}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
