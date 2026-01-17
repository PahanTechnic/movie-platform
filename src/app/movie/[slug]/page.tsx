/* eslint-disable @typescript-eslint/no-explicit-any */
// app/movie/[slug]/page.tsx
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { tmdbImage } from '@/lib/tmdb'
import MovieImage from '@/components/MovieImage'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import DownloadButton from '@/components/DownloadButton'
import {
  Play,
  Download,
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  Tv,
  Sparkles,
  Users,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Heart,
  Share2,
  Bookmark,
  Eye,
  Info,
  Award
} from 'lucide-react'

export default async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params

  const { data: movie } = await supabase
    .from('movies')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!movie) {
    notFound()
  }

  const { data: relatedMovies } = await supabase
    .from('movies')
    .select('*')
    .eq('content_category', movie.content_category)
    .neq('id', movie.id)
    .limit(10)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MOVIE': return <Film className="w-4 h-4" />
      case 'TV_SERIES': return <Tv className="w-4 h-4" />
      case 'CARTOON': return <Sparkles className="w-4 h-4" />
      case 'ANIME': return <Sparkles className="w-4 h-4" />
      default: return <Film className="w-4 h-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'MOVIE': return 'Movie'
      case 'TV_SERIES': return 'TV Series'
      case 'CARTOON': return 'Cartoon'
      case 'ANIME': return 'Anime'
      default: return 'Movie'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section with Visible Background */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image - More Visible */}
        <div className="absolute inset-0">
          {movie.backdrop_path && (
            <MovieImage
              src={tmdbImage(movie.backdrop_path, 'original')}
              alt={movie.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          )}
          
          {/* Gradient Overlays for readability while keeping image visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Animated Green Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-green-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

            {/* Poster with Glass Effect */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/40 via-green-400/30 to-emerald-600/40 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-700" />
                
                {/* Glass Border */}
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400/50 via-green-500/30 to-emerald-600/50 rounded-2xl" />
                
                {/* Poster Container */}
                <div className="relative w-72 sm:w-80 lg:w-96 aspect-[2/3] rounded-2xl overflow-hidden bg-black/50 backdrop-blur-sm">
                  <MovieImage
                    src={tmdbImage(movie.poster_path, 'w780')}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
                  />

                  {/* Glass Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Rating Badge - Glass */}
                  {movie.vote_average && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-emerald-400/40 shadow-lg shadow-emerald-500/20">
                      <Star className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                      <span className="font-bold text-white text-lg">{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Category Badge - Glass */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-xl rounded-full border border-emerald-400/30">
                    {getCategoryIcon(movie.content_category)}
                    <span className="text-sm font-bold text-emerald-300">{getCategoryLabel(movie.content_category)}</span>
                  </div>

                  {/* Play Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/30 backdrop-blur-xl flex items-center justify-center border-2 border-emerald-400/60 shadow-2xl shadow-emerald-500/50 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <Play className="w-10 h-10 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Glass Pills */}
              <div className="flex justify-center gap-4 mt-8">
                {[
                  { icon: Heart, label: 'Like' },
                  { icon: Bookmark, label: 'Save' },
                  { icon: Share2, label: 'Share' }
                ].map((item, index) => (
                  <button
                    key={index}
                    className="group flex items-center justify-center w-16 h-16 rounded-2xl bg-black/30 hover:bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
                  >
                    <item.icon className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300" />
                  </button>
                ))}
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-white via-emerald-100 to-green-200 bg-clip-text text-transparent drop-shadow-2xl">
                    {movie.title}
                  </span>
                </h1>
                
                {/* Gradient Line */}
                <div className="flex justify-center lg:justify-start">
                  <div className="h-1.5 w-48 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/50" />
                </div>
              </div>

              {/* Meta Pills - Glass */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
                {movie.release_year && (
                  <div className="flex items-center gap-2.5 px-5 py-3 bg-black/30 backdrop-blur-xl rounded-full border border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all duration-300 shadow-lg">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-white">{movie.release_year}</span>
                  </div>
                )}

                {movie.runtime && (
                  <div className="flex items-center gap-2.5 px-5 py-3 bg-black/30 backdrop-blur-xl rounded-full border border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all duration-300 shadow-lg">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-white">{movie.runtime} min</span>
                  </div>
                )}

                {movie.original_language && (
                  <div className="flex items-center gap-2.5 px-5 py-3 bg-black/30 backdrop-blur-xl rounded-full border border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all duration-300 shadow-lg">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-white uppercase">{movie.original_language}</span>
                  </div>
                )}

                {movie.download_count > 0 && (
                  <div className="flex items-center gap-2.5 px-5 py-3 bg-emerald-500/20 backdrop-blur-xl rounded-full border border-emerald-400/50 shadow-lg shadow-emerald-500/20">
                    <Download className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-emerald-300">{movie.download_count.toLocaleString()} downloads</span>
                  </div>
                )}
              </div>

              {/* Genres - Glass Tags */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {movie.genres.map((genre: string, index: number) => (
                    <span
                      key={`${genre}-${index}`}
                      className="px-5 py-2.5 bg-gradient-to-br from-emerald-500/15 to-green-600/10 backdrop-blur-xl rounded-full text-sm font-bold text-emerald-300 border border-emerald-400/30 hover:border-emerald-400/60 hover:bg-emerald-500/25 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview - Glass Card */}
              {movie.overview && (
                <div className="p-6 bg-black/30 backdrop-blur-xl rounded-2xl border border-emerald-500/20 shadow-xl">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {movie.overview}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                {movie.preview_link && (
                  <a
                    href={movie.preview_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-black/40 backdrop-blur-xl border-2 border-emerald-500/40 hover:border-emerald-400/80 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden shadow-xl hover:shadow-emerald-500/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <Play className="w-6 h-6 text-emerald-400 fill-emerald-400" />
                    <span className="text-white">Watch Trailer</span>
                    <ExternalLink className="w-5 h-5 text-emerald-400 opacity-60 group-hover:opacity-100" />
                  </a>
                )}

                <a
                  href="#downloads"
                  className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-500 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <Download className="w-6 h-6" />
                  <span>Download Now</span>
                </a>
              </div>

              {/* Stats Cards - Glass Grid */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="group text-center p-6 bg-black/30 backdrop-blur-xl rounded-2xl border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-all duration-300 shadow-lg cursor-pointer">
                  <Star className="w-8 h-8 text-emerald-400 fill-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-3xl font-black text-emerald-400">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Rating</p>
                </div>

                <div className="group text-center p-6 bg-black/30 backdrop-blur-xl rounded-2xl border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-all duration-300 shadow-lg cursor-pointer">
                  <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-3xl font-black text-emerald-400">{movie.vote_count ? (movie.vote_count / 1000).toFixed(1) + 'K' : 'N/A'}</span>
                  <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Votes</p>
                </div>

                <div className="group text-center p-6 bg-black/30 backdrop-blur-xl rounded-2xl border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-all duration-300 shadow-lg cursor-pointer">
                  <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-3xl font-black text-emerald-400">{movie.popularity?.toFixed(0) || 'N/A'}</span>
                  <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Popular</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-10 h-16 rounded-full border-2 border-emerald-400/50 bg-black/30 backdrop-blur-xl flex items-start justify-center p-3 shadow-lg shadow-emerald-500/20">
            <div className="w-2 h-4 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {/* Background Glow for Content */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Video Player Section */}
        <section className="relative space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-gradient-to-b from-emerald-400 to-green-600 rounded-full shadow-lg shadow-emerald-500/50" />
            <h2 className="text-4xl font-black text-white">Watch Now</h2>
            <Eye className="w-8 h-8 text-emerald-400 ml-2" />
          </div>

          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500/30 via-green-500/30 to-emerald-600/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Glass Container */}
            <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden border-2 border-emerald-500/30 group-hover:border-emerald-400/60 transition-all duration-500 shadow-2xl shadow-emerald-500/10">
              <div className="aspect-video">
                <iframe
                  src={movie.video_url}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* Download & Details Grid */}
        <section id="downloads" className="relative scroll-mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Download Section - Glass Card */}
            <div className="relative group h-full">
              <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-emerald-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative h-full bg-black/40 backdrop-blur-2xl rounded-3xl p-8 border-2 border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-300 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-green-600/10 backdrop-blur-xl rounded-2xl border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
                    <Download className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Download Files</h3>
                    <p className="text-gray-400 mt-1">Choose your preferred quality</p>
                  </div>
                </div>

                {movie.resolution_links && Object.keys(movie.resolution_links).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(movie.resolution_links).map(([resolution, data]: [string, any], index: number) => (
                      <DownloadButton
                        key={`${resolution}-${index}`}
                        movieId={movie.id}
                        resolution={resolution}
                        downloadUrl={data.download_url}
                        fileSize={data.file_size}
                      />
                    ))}
                  </div>
                ) : movie.download_link ? (
                  <DownloadButton
                    movieId={movie.id}
                    resolution="HD"
                    downloadUrl={movie.download_link}
                  />
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <Download className="w-20 h-20 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">No download links available</p>
                  </div>
                )}

                {movie.preview_link && (
                  <a
                    href={movie.preview_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn flex items-center justify-center gap-3 w-full mt-8 px-6 py-4 bg-black/40 hover:bg-emerald-500/15 backdrop-blur-xl border-2 border-emerald-500/30 hover:border-emerald-400/60 rounded-2xl font-bold transition-all duration-300 shadow-lg"
                  >
                    <Play className="w-6 h-6 text-emerald-400 fill-emerald-400" />
                    <span className="text-white">Watch Trailer</span>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover/btn:text-emerald-400 transition-colors" />
                  </a>
                )}
              </div>
            </div>

            {/* Movie Details - Glass Card */}
            <div className="relative group h-full">
              <div className="absolute -inset-2 bg-gradient-to-br from-green-500/15 via-emerald-500/15 to-green-600/15 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative h-full bg-black/40 backdrop-blur-2xl rounded-3xl p-8 border-2 border-emerald-500/30 hover:border-green-400/60 transition-all duration-300 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-600/10 backdrop-blur-xl rounded-2xl border border-green-400/30 shadow-lg shadow-green-500/20">
                    <Info className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Movie Details</h3>
                    <p className="text-gray-400 mt-1">Additional information</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {[
                    { label: 'Director', value: movie.director },
                    { label: 'Countries', value: movie.countries?.join(', ') },
                    { label: 'Language', value: movie.original_language?.toUpperCase() },
                    { label: 'Subtitles By', value: movie.subtitle_by, highlight: true },
                    { label: 'Quality', value: movie.webdl, badge: true },
                    { label: 'Total Downloads', value: movie.download_count?.toLocaleString(), large: true }
                  ].filter(item => item.value).map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-4 px-4 -mx-4 rounded-xl hover:bg-emerald-500/10 border-b border-emerald-500/10 last:border-0 transition-colors">
                      <span className="text-gray-400 font-medium">{item.label}</span>
                      {item.badge ? (
                        <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/10 text-emerald-300 rounded-full text-sm font-bold border border-emerald-400/30">{item.value}</span>
                      ) : item.large ? (
                        <span className="font-black text-2xl text-emerald-400">{item.value}</span>
                      ) : (
                        <span className={`font-semibold ${item.highlight ? 'text-emerald-400' : 'text-white'}`}>{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <section className="relative">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-1.5 h-12 bg-gradient-to-b from-emerald-400 to-green-600 rounded-full shadow-lg shadow-emerald-500/50" />
              <h2 className="text-4xl font-black text-white">Cast</h2>
              <Users className="w-8 h-8 text-emerald-400 ml-2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movie.cast.slice(0, 12).map((actor: any, index: number) => (
                <div
                  key={`${actor.id}-${index}`}
                  className="group relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-2 cursor-pointer"
                >
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto border-3 border-emerald-500/30 group-hover:border-emerald-400/70 transition-all duration-300 shadow-lg shadow-emerald-500/20">
                    {actor.profile_path ? (
                      <MovieImage
                        src={tmdbImage(actor.profile_path, 'w185')}
                        alt={actor.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-900/50 to-black flex items-center justify-center">
                        <Users className="w-10 h-10 text-emerald-500/50" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-center text-white truncate">{actor.name}</h4>
                  {actor.character && (
                    <p className="text-xs text-emerald-400/70 text-center truncate mt-1">{actor.character}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Movies */}
        {relatedMovies && relatedMovies.length > 0 && (
          <section className="relative">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-12 bg-gradient-to-b from-emerald-400 to-green-600 rounded-full shadow-lg shadow-emerald-500/50" />
                <h2 className="text-4xl font-black text-white">
                  More {getCategoryLabel(movie.content_category)}
                  {movie.content_category !== 'ANIME' && 's'}
                </h2>
              </div>

              <Link
                href={
                  movie.content_category === 'MOVIE' ? '/movies' :
                    movie.content_category === 'TV_SERIES' ? '/tv-series' :
                      movie.content_category === 'CARTOON' ? '/cartoons' :
                        movie.content_category === 'ANIME' ? '/anime' : '/movies'
                }
                className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/40 hover:bg-emerald-500/15 backdrop-blur-xl border-2 border-emerald-500/30 hover:border-emerald-400/60 font-bold transition-all duration-300 shadow-lg"
              >
                <span className="text-gray-300 group-hover:text-emerald-300 transition-colors">View All</span>
                <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {relatedMovies.map((relatedMovie, index: number) => (
                <Link
                  key={`${relatedMovie.id}-${index}`}
                  href={`/movie/${relatedMovie.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-black/50 border-2 border-emerald-500/20 hover:border-emerald-400/60 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30">
                    {/* Glow */}
                    <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/40 to-green-500/40 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />

                    <MovieImage
                      src={tmdbImage(relatedMovie.poster_path, 'w500')}
                      alt={relatedMovie.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Rating */}
                    {relatedMovie.vote_average && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-full border border-emerald-400/40 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                        <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                        <span className="text-sm font-bold text-white">{relatedMovie.vote_average.toFixed(1)}</span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-bold text-white line-clamp-2 mb-2">
                        {relatedMovie.title}
                      </h3>
                      <span className="text-sm text-emerald-400 font-semibold">{relatedMovie.release_year}</span>
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/30 backdrop-blur-xl flex items-center justify-center border-2 border-emerald-400/60 shadow-2xl shadow-emerald-500/50 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Title */}
                  <div className="mt-4 lg:hidden">
                    <h3 className="font-bold text-sm text-white line-clamp-2 mb-1">
                      {relatedMovie.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{relatedMovie.release_year}</span>
                      {relatedMovie.vote_average && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                          <span className="text-xs text-emerald-400 font-semibold">{relatedMovie.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer Gradient */}
      <div className="h-32 bg-gradient-to-t from-emerald-950/20 to-transparent" />
    </div>
  )
}