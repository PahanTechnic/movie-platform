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
  Info
} from 'lucide-react'

export default async function MovieDetailPage({ params }: { params: { slug: string } }) {
  const { data: movie } = await supabase
    .from('movies')
    .select('*')
    .eq('slug', params.slug)
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
    switch(category) {
      case 'MOVIE': return <Film className="w-4 h-4" />
      case 'TV_SERIES': return <Tv className="w-4 h-4" />
      case 'CARTOON': return <Sparkles className="w-4 h-4" />
      case 'ANIME': return <Sparkles className="w-4 h-4" />
      default: return <Film className="w-4 h-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch(category) {
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

      {/* Hero Section */}
      <div className="relative min-h-[90vh] lg:min-h-[85vh]">
        {/* Backdrop Image */}
        {movie.backdrop_path && (
          <div className="absolute inset-0">
            <MovieImage
              src={tmdbImage(movie.backdrop_path, 'original')}
              alt={movie.title}
              fill
              className="object-cover object-top opacity-30"
              priority
            />
            {/* Dark Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            
            {/* Green Accent Glow */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
          </div>
        )}

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Poster Card */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative group">
                {/* Green Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-b from-green-500/50 to-emerald-600/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition duration-700" />
                <div className="absolute -inset-0.5 bg-gradient-to-b from-green-500/20 to-transparent rounded-2xl" />
                
                <div className="relative w-64 sm:w-72 lg:w-80 aspect-[2/3] rounded-2xl overflow-hidden border border-green-500/20 shadow-2xl shadow-black">
                  <MovieImage
                    src={tmdbImage(movie.poster_path, 'w780')}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Dark Glass Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Rating Badge */}
                  {movie.vote_average && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-full border border-green-500/30">
                      <Star className="w-4 h-4 text-green-400 fill-green-400" />
                      <span className="font-bold text-green-400">{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 backdrop-blur-md rounded-full border border-green-500/30">
                    {getCategoryIcon(movie.content_category)}
                    <span className="text-sm font-medium text-green-400">{getCategoryLabel(movie.content_category)}</span>
                  </div>

                  {/* Play Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 backdrop-blur-md flex items-center justify-center border border-green-500/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-7 h-7 text-green-400 fill-green-400 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 mt-6">
                <button className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-green-500/20 backdrop-blur-sm border border-white/10 hover:border-green-500/50 transition-all duration-300 group">
                  <Heart className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                </button>
                <button className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-green-500/20 backdrop-blur-sm border border-white/10 hover:border-green-500/50 transition-all duration-300 group">
                  <Bookmark className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                </button>
                <button className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-green-500/20 backdrop-blur-sm border border-white/10 hover:border-green-500/50 transition-all duration-300 group">
                  <Share2 className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                </button>
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-center lg:text-left">
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-white leading-tight">
                {movie.title}
              </h1>

              {/* Subtitle/Tagline line */}
              <div className="h-1 w-32 mx-auto lg:mx-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6" />

              {/* Meta Info Pills */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-6">
                {movie.release_year && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:border-green-500/30 transition-colors">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-gray-300">{movie.release_year}</span>
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:border-green-500/30 transition-colors">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-gray-300">{movie.runtime} min</span>
                  </div>
                )}

                {movie.original_language && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:border-green-500/30 transition-colors">
                    <Globe className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-gray-300 uppercase">{movie.original_language}</span>
                  </div>
                )}

                {movie.download_count > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 backdrop-blur-md rounded-full border border-green-500/30">
                    <Download className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-green-400">{movie.download_count.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                  {movie.genres.map((genre: string) => (
                    <span
                      key={genre}
                      className="px-4 py-1.5 bg-green-500/10 rounded-full text-sm font-medium text-green-400 border border-green-500/20 hover:border-green-500/50 hover:bg-green-500/20 transition-all cursor-pointer"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <div className="mb-8">
                  <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto lg:mx-0">
                    {movie.overview}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8">
                {movie.preview_link && (
                  <a
                    href={movie.preview_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-xl font-bold text-lg transition-all duration-300"
                  >
                    <Play className="w-6 h-6 text-white fill-white" />
                    <span>Watch Trailer</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}

                <a
                  href="#downloads"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                >
                  <Download className="w-6 h-6" />
                  Download Now
                </a>
              </div>

              {/* Quick Stats - Glass Cards */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div className="text-center p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-green-500/30 transition-colors group">
                  <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                    <Star className="w-5 h-5 fill-green-400 group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-bold">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <p className="text-xs text-gray-500">IMDB Rating</p>
                </div>
                
                <div className="text-center p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-green-500/30 transition-colors group">
                  <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                    <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-bold">{movie.vote_count ? (movie.vote_count / 1000).toFixed(1) + 'K' : 'N/A'}</span>
                  </div>
                  <p className="text-xs text-gray-500">Votes</p>
                </div>
                
                <div className="text-center p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-green-500/30 transition-colors group">
                  <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                    <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-bold">{movie.popularity?.toFixed(0) || 'N/A'}</span>
                  </div>
                  <p className="text-xs text-gray-500">Popularity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-green-500/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-green-500/50 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Video Player Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full" />
            <h2 className="text-3xl font-bold text-white">Watch Now</h2>
            <Eye className="w-6 h-6 text-green-500 ml-2" />
          </div>

          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-green-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />
            
            <div className="relative bg-black/50 backdrop-blur-md rounded-2xl overflow-hidden border border-green-500/20 hover:border-green-500/40 transition-colors">
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
        <section id="downloads" className="scroll-mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Download Section */}
            <div className="relative group">
              {/* Subtle Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-b from-green-500/30 to-transparent rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative h-full bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <Download className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Download Files</h3>
                    <p className="text-sm text-gray-500">Choose your preferred quality</p>
                  </div>
                </div>

                {movie.resolution_links && Object.keys(movie.resolution_links).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(movie.resolution_links).map(([resolution, data]: [string, any]) => (
                      <DownloadButton
                        key={resolution}
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
                  <div className="text-center py-8 text-gray-500">
                    <Download className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No download links available</p>
                  </div>
                )}

                {/* Trailer Button */}
                {movie.preview_link && (
                  <a
                    href={movie.preview_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full mt-4 px-6 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-xl font-semibold transition-all duration-300"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>Watch Trailer</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Movie Details Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-green-500/20 to-transparent rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative h-full bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Info className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Movie Details</h3>
                    <p className="text-sm text-gray-500">Additional information</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {movie.director && (
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-gray-500">Director</span>
                      <span className="font-medium text-white">{movie.director}</span>
                    </div>
                  )}

                  {movie.countries && movie.countries.length > 0 && (
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-gray-500">Countries</span>
                      <span className="font-medium text-white">{movie.countries.join(', ')}</span>
                    </div>
                  )}

                  {movie.original_language && (
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-gray-500">Language</span>
                      <span className="font-medium text-white uppercase">{movie.original_language}</span>
                    </div>
                  )}

                  {movie.subtitle_by && (
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-gray-500">Subtitles By</span>
                      <span className="font-medium text-green-400">{movie.subtitle_by}</span>
                    </div>
                  )}

                  {movie.webdl && (
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-gray-500">Quality</span>
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20">{movie.webdl}</span>
                    </div>
                  )}

                  {movie.download_count > 0 && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500">Total Downloads</span>
                      <span className="font-bold text-green-400">{movie.download_count.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full" />
              <h2 className="text-3xl font-bold text-white">Cast</h2>
              <Users className="w-6 h-6 text-green-500 ml-2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movie.cast.slice(0, 12).map((actor: any) => (
                <div
                  key={actor.id}
                  className="group relative bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/5 hover:border-green-500/30 transition-all duration-300"
                >
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 mx-auto border-2 border-transparent group-hover:border-green-500/50 transition-colors">
                    {actor.profile_path ? (
                      <MovieImage
                        src={tmdbImage(actor.profile_path, 'w185')}
                        alt={actor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-center text-white truncate">{actor.name}</h4>
                  {actor.character && (
                    <p className="text-xs text-gray-500 text-center truncate mt-1">{actor.character}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Movies */}
        {relatedMovies && relatedMovies.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full" />
                <h2 className="text-3xl font-bold text-white">
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
                className="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-green-500/10 border border-white/10 hover:border-green-500/30 font-semibold transition-all"
              >
                <span className="text-gray-300 group-hover:text-green-400 transition-colors">View All</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {relatedMovies.map((relatedMovie) => (
                <Link
                  key={relatedMovie.id}
                  href={`/movie/${relatedMovie.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-black/50 border border-white/5 hover:border-green-500/30 transition-all duration-500">
                    {/* Green Glow on hover */}
                    <div className="absolute -inset-0.5 bg-green-500/30 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition duration-500 -z-10" />
                    
                    <MovieImage
                      src={tmdbImage(relatedMovie.poster_path, 'w500')}
                      alt={relatedMovie.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Rating Badge */}
                    {relatedMovie.vote_average && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg border border-green-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Star className="w-3 h-3 text-green-400 fill-green-400" />
                        <span className="text-xs font-bold text-green-400">{relatedMovie.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                    
                    {/* Info on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-sm text-white line-clamp-2 mb-1">
                        {relatedMovie.title}
                      </h3>
                      <span className="text-xs text-green-400">{relatedMovie.release_year}</span>
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-green-500/20 backdrop-blur-sm flex items-center justify-center border border-green-500/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 text-green-400 fill-green-400 ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Title */}
                  <div className="mt-3 lg:hidden">
                    <h3 className="font-semibold text-sm text-white line-clamp-2">
                      {relatedMovie.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{relatedMovie.release_year}</span>
                      {relatedMovie.vote_average && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-green-400 fill-green-400" />
                          <span className="text-xs text-green-400">{relatedMovie.vote_average.toFixed(1)}</span>
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

      {/* Footer Spacing */}
      <div className="h-20" />
    </div>
  )
}