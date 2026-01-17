import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#020617] border-r border-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-8 text-white">Admin Panel</h1>

        <nav className="space-y-2">
          <a
            href="/admin/dashboard"
            className="block px-4 py-2 rounded bg-blue-600 text-white"
          >
            Dashboard
          </a>

          <a
            href="/admin/movies"
            className="block px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            Movies
          </a>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-gray-400 text-sm truncate">
            {session.user.email}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
