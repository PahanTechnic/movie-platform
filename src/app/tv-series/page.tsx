// app/tv-series/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { tmdbImage } from '@/lib/tmdb'
import MovieImage from '@/components/MovieImage'
import Navbar from '@/components/Navbar'

export default async function TVSeriesPage() {
  // Fetch all TV series
  const { data: series } = await supabase
  .from('movies')
  .select('*')
  .eq('content_category', 'TV_SERIES')  // Changed from language_category
  .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">TV Series</h1>
          <p className="text-gray-400 text-lg">
            Explore our collection of {series?.length || 0} TV series
          </p>
        </div>

        {/* TV Series Grid */}
        {series && series.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {series.map((show) => (
              <Link
                key={show.id}
                href={`/movie/${show.slug}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  <MovieImage
                    src={tmdbImage(show.poster_path, 'w500')}
                    alt={show.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-sm line-clamp-2 mb-1">
                      {show.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <span>{show.release_year}</span>
                      {show.vote_average && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">⭐</span>
                            <span>{show.vote_average.toFixed(1)}</span>
                          </div>
                        </>
                      )}
                    </div>
                    {show.runtime && (
                      <p className="text-xs text-gray-400 mt-1">
                        {show.runtime} min per episode
                      </p>
                    )}
                  </div>
                </div>

                {/* Mobile Info */}
                <div className="mt-2 lg:hidden">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {show.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span>{show.release_year}</span>
                    {show.vote_average && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          {show.vote_average.toFixed(1)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 mx-auto mb-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No TV Series Found
            </h2>
            <p className="text-gray-500">
              Check back later for new TV series
            </p>
          </div>
        )}
      </main>
    </div>
  )
}