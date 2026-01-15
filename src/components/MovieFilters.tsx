'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function MovieFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const [genre, setGenre] = useState(params.get('genre') || '')
  const [year, setYear] = useState(params.get('year') || '')
  const [rating, setRating] = useState(params.get('rating') || '')

  function applyFilters() {
    const query = new URLSearchParams()

    if (genre) query.set('genre', genre)
    if (year) query.set('year', year)
    if (rating) query.set('rating', rating)

    router.push(`/search?${query.toString()}`)
  }

  return (
    <div className="bg-zinc-900 p-4 rounded-xl flex flex-wrap gap-4">
      {/* Genre */}
      <select
        className="bg-zinc-800 text-white px-4 py-2 rounded"
        value={genre}
        onChange={e => setGenre(e.target.value)}
      >
        <option value="">All Genres</option>
        <option value="Action">Action</option>
        <option value="Drama">Drama</option>
        <option value="Comedy">Comedy</option>
        <option value="Horror">Horror</option>
      </select>

      {/* Year */}
      <input
        type="number"
        placeholder="Year"
        className="bg-zinc-800 text-white px-4 py-2 rounded"
        value={year}
        onChange={e => setYear(e.target.value)}
      />

      {/* Rating */}
      <select
        className="bg-zinc-800 text-white px-4 py-2 rounded"
        value={rating}
        onChange={e => setRating(e.target.value)}
      >
        <option value="">Any Rating</option>
        <option value="5">5+</option>
        <option value="6">6+</option>
        <option value="7">7+</option>
        <option value="8">8+</option>
      </select>

      <button
        onClick={applyFilters}
        className="bg-red-600 px-6 py-2 rounded text-white"
      >
        Apply
      </button>
    </div>
  )
}
