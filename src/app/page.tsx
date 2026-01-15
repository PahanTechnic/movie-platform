// app/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { tmdbImage } from '@/lib/tmdb'
import MovieImage from '@/components/MovieImage'
import HeroSlider from '@/components/HeroSlider'
import Navbar from '@/components/Navbar'

export default async function HomePage() {
  // Fetch top downloaded movies (Most Popular)
  const { data: topDownloads } = await supabase
    .from('movies')
    .select('*')
    .order('download_count', { ascending: false })
    .limit(20)

  // Fetch latest movies
  const { data: latestMovies } = await supabase
    .from('movies')
    .select('*')
    .eq('content_category', 'MOVIE')
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: topRatedMovies } = await supabase
    .from('movies')
    .select('*')
    .eq('content_category', 'MOVIE')
    .order('vote_average', { ascending: false })
    .limit(20)

  // Fetch TV Series
  const { data: latestSeries } = await supabase
    .from('movies')
    .select('*')
    .eq('content_category', 'TV_SERIES')
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: topRatedSeries } = await supabase
    .from('movies')
    .select('*')
    .eq('content_category', 'TV_SERIES')
    .order('vote_average', { ascending: false })
    .limit(20)

  // Get hero slides (top 3 latest items - movies and series combined)
  const { data: allContent } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  const heroSlides = allContent || []
  const trendingMovies = latestMovies?.slice(0, 10) || []
  const trendingSeries = latestSeries?.slice(0, 10) || []
  const mostDownloaded = topDownloads?.slice(0, 10) || []

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Slider - Auto sliding every 4 seconds */}
      {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 pb-12 space-y-16">
        {/* 🔥 Most Downloaded Section (NEW) */}
        {mostDownloaded.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <span className="text-4xl">🔥</span>
                Most Downloaded
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {mostDownloaded.map((movie, index) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.slug}`}
                  className="group relative"
                >
                  {/* Ranking Badge */}
                  <div className="absolute -top-2 -left-2 z-10 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white">
                    {index + 1}
                  </div>

                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <MovieImage
                      src={tmdbImage(movie.poster_path, 'w500')}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-sm line-clamp-2 mb-1">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span>{movie.release_year}</span>
                        {movie.vote_average && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">⭐</span>
                              <span>{movie.vote_average.toFixed(1)}</span>
                            </div>
                          </>
                        )}
                      </div>
                      {movie.download_count && (
                        <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                          <span>📥</span>
                          <span className="font-semibold">{movie.download_count.toLocaleString()} downloads</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 lg:hidden">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span>{movie.release_year}</span>
                      {movie.download_count && (
                        <>
                          <span>•</span>
                          <span className="text-green-400">📥 {movie.download_count}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending Movies Section */}
        {trendingMovies.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">Trending Movies</h2>
              <Link
                href="/movies"
                className="px-6 py-2 rounded-lg border-2 border-white/30 text-sm font-semibold hover:bg-white/10 transition-all"
              >
                View More
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {trendingMovies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <MovieImage
                      src={tmdbImage(movie.poster_path, 'w500')}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-sm line-clamp-2 mb-1">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span>{movie.release_year}</span>
                        {movie.vote_average && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">⭐</span>
                              <span>{movie.vote_average.toFixed(1)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 lg:hidden">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {movie.release_year}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top Rated Movies Section */}
        {topRatedMovies && topRatedMovies.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">Top Rated Movies</h2>
              <Link
                href="/movies"
                className="px-6 py-2 rounded-lg border-2 border-white/30 text-sm font-semibold hover:bg-white/10 transition-all"
              >
                View More
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {topRatedMovies.slice(0, 10).map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <MovieImage
                      src={tmdbImage(movie.poster_path, 'w500')}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-sm line-clamp-2 mb-1">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span>{movie.release_year}</span>
                        {movie.vote_average && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">⭐</span>
                              <span className="font-semibold">
                                {movie.vote_average.toFixed(1)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 lg:hidden">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span>{movie.release_year}</span>
                      {movie.vote_average && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-400">⭐</span>
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending TV Series Section */}
        {trendingSeries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">Trending TV Series</h2>
              <Link
                href="/tv-series"
                className="px-6 py-2 rounded-lg border-2 border-white/30 text-sm font-semibold hover:bg-white/10 transition-all"
              >
                View More
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {trendingSeries.map((series) => (
                <Link
                  key={series.id}
                  href={`/movie/${series.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <MovieImage
                      src={tmdbImage(series.poster_path, 'w500')}
                      alt={series.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-sm line-clamp-2 mb-1">
                        {series.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span>{series.release_year}</span>
                        {series.vote_average && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">⭐</span>
                              <span>{series.vote_average.toFixed(1)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 lg:hidden">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {series.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {series.release_year}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top Rated TV Series Section */}
        {topRatedSeries && topRatedSeries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">Top Rated TV Series</h2>
              <Link
                href="/tv-series"
                className="px-6 py-2 rounded-lg border-2 border-white/30 text-sm font-semibold hover:bg-white/10 transition-all"
              >
                View More
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {topRatedSeries.slice(0, 10).map((series) => (
                <Link
                  key={series.id}
                  href={`/movie/${series.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <MovieImage
                      src={tmdbImage(series.poster_path, 'w500')}
                      alt={series.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-sm line-clamp-2 mb-1">
                        {series.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span>{series.release_year}</span>
                        {series.vote_average && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">⭐</span>
                              <span className="font-semibold">
                                {series.vote_average.toFixed(1)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 lg:hidden">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {series.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span>{series.release_year}</span>
                      {series.vote_average && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-400">⭐</span>
                            {series.vote_average.toFixed(1)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {(!latestMovies || latestMovies.length === 0) && (!latestSeries || latestSeries.length === 0) && (
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
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No Content Yet
            </h2>
            <p className="text-gray-500">
              Add some movies and TV series from the admin panel to get started
            </p>
          </div>
        )}
      </main>
    </div>
  )
}