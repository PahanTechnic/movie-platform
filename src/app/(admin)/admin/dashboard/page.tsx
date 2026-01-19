// ==========================================
// FILE 3: app/admin/dashboard/page.tsx
// ==========================================
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/admin/login')
        return
      }

      // Fetch movie count
      const { count } = await supabase
        .from('movies')
        .select('*', { count: 'exact', head: true })

      setCount(count || 0)
      setLoading(false)
    }
    
    checkAuthAndFetch()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#020617] p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400">Total Movies</p>
            <h2 className="text-4xl font-bold mt-2 text-white">{count}</h2>
          </div>
        </div>

        <Link
          href="/admin/movies"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-medium"
        >
          Manage Movies →
        </Link>
      </div>
    </div>
  )
}