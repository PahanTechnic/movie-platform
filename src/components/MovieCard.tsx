/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { Star, Calendar } from 'lucide-react'

interface Movie {
  id: string
  title: string
  slug: string
  poster_path: string | null
  release_year: number
  rating: number
}

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movie/${movie.slug}`}>
      <div className="group cursor-pointer rounded-xl overflow-hidden bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 shadow-lg">
        
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/no-poster.png'
            }
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1 text-sm text-yellow-400">
            <Star size={14} fill="currentColor" />
            {movie.rating?.toFixed(1)}
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm line-clamp-2">
            {movie.title}
          </h3>

          <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
            <Calendar size={12} />
            {movie.release_year}
          </div>
        </div>
      </div>
    </Link>
  )
}
