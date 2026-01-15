/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<any[]>([])

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })

      setMovies(data || [])
    }
    fetchMovies()
  }, [])

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Movies</h1>
        <Link
          href="/admin/movies/new"
          className="bg-blue-600 px-4 py-2 rounded"
        >
          + Add Movie
        </Link>
      </div>

      <div className="space-y-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex justify-between bg-[#020617] p-4 rounded border border-gray-800"
          >
            <div>
              <h2 className="font-semibold">{movie.title}</h2>
              <p className="text-sm text-gray-400">
                {movie.release_year}
              </p>
            </div>

            <Link
              href={`/admin/movies/edit/${movie.id}`}
              className="text-blue-400"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
