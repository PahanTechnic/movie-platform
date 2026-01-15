/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login')
      } else {
        setUser(session?.user)
      }
      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (!session && pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [pathname, router])

  // const handleLogout = async () => {
  //   await supabase.auth.signOut()
  //   router.push('/admin/login')
  // }

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#020617] border-r border-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-8 text-white">Admin Panel</h1>
        
        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className={`block px-4 py-2 rounded transition ${
              pathname === '/admin/dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            Dashboard
          </Link>
          
          <Link
            href="/admin/movies"
            className={`block px-4 py-2 rounded transition ${
              pathname?.startsWith('/admin/movies')
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            Movies
          </Link>
        </nav>

        {user && (
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-gray-400 text-sm mb-2 truncate">
              {user.email}
            </div>
            {/* <button
              onClick={handleLogout}
              className="w-10 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button> */}
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}