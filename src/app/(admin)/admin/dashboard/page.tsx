'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('movies')
        .select('*', { count: 'exact', head: true })

      setCount(count || 0)
    }
    fetchCount()
  }, [])

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#020617] p-6 rounded-xl border border-gray-800">
          <p className="text-gray-400">Total Movies</p>
          <h2 className="text-4xl font-bold mt-2">{count}</h2>
        </div>
      </div>

      <Link
        href="/admin/movies"
        className="inline-block mt-8 bg-blue-600 px-6 py-2 rounded"
      >
        Manage Movies →
      </Link>
    </div>
  )
}
