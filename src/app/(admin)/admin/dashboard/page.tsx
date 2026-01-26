'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { count } = await supabase
          .from('movies')
          .select('*', { count: 'exact', head: true })

        setCount(count || 0)
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome to your admin dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#020617] p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Movies</p>
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white">{count}</h2>
            <p className="text-gray-500 text-sm mt-1">Movies in database</p>
          </div>

          <div className="bg-[#020617] p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Active Users</p>
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white">1,245</h2>
            <p className="text-green-500 text-sm mt-1">+12% from last month</p>
          </div>

          <div className="bg-[#020617] p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white">$4,560</h2>
            <p className="text-purple-500 text-sm mt-1">+8% from last month</p>
          </div>
        </div>

        <div className="bg-[#020617] p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/movies"
              className="flex items-center justify-between p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group"
            >
              <span className="text-white font-medium">Manage Movies</span>
              <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <Link
              href="/admin/movies/new"
              className="flex items-center justify-between p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors group"
            >
              <span className="text-white font-medium">Add New Movie</span>
              <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
