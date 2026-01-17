// components/Navbar.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { tmdbImage } from '@/lib/tmdb'
import MovieImage from './MovieImage'
import {
  Menu,
  X,
  Home,
  Film,
  Tv,
  Search,
  Sparkles,
  Play,
  Star,
  Loader2,
  TrendingUp
} from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  slug: string
  poster_path: string
  release_year: number
  vote_average: number
  content_category: string
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
        setSearchResults([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search function
  useEffect(() => {
    const searchMovies = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('id, title, slug, poster_path, release_year, vote_average, content_category')
          .ilike('title', `%${searchQuery}%`)
          .limit(8)

        if (error) throw error
        setSearchResults(data || [])
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounce = setTimeout(searchMovies, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Movies', href: '/movies', icon: Film },
    { name: 'TV Series', href: '/tv-series', icon: Tv },
    { name: 'Anime', href: '/anime', icon: Sparkles },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'MOVIE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'TV_SERIES': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'ANIME': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'CARTOON': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'MOVIE': return 'Movie'
      case 'TV_SERIES': return 'TV'
      case 'ANIME': return 'Anime'
      case 'CARTOON': return 'Cartoon'
      default: return 'Movie'
    }
  }

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
      setSearchResults([])
    }
  }

  const handleResultClick = (slug: string) => {
    router.push(`/movie/${slug}`)
    setIsSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    setIsMobileMenuOpen(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/70 backdrop-blur-2xl border-b border-emerald-500/20 shadow-lg shadow-emerald-500/5'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-white via-emerald-200 to-green-300 bg-clip-text text-transparent hidden sm:block">
                MovieHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 group ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-emerald-400'} transition-colors`} />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block relative" ref={searchRef}>
              <div className="relative">
                <div className={`flex items-center gap-2 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-xl border ${
                  isSearchOpen || searchQuery 
                    ? 'border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/20' 
                    : 'border-white/10 hover:border-emerald-500/30'
                } h-12 rounded-full overflow-hidden transition-all duration-300 ${
                  isSearchOpen ? 'w-80' : 'w-64'
                }`}>
                  <div className="pl-5 flex items-center justify-center">
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Search movies, series..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 h-full bg-transparent outline-none text-sm text-white placeholder-gray-500 font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('')
                        setSearchResults([])
                      }}
                      className="hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group"
                    >
                      <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    disabled={!searchQuery.trim()}
                    className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed px-6 h-9 rounded-full text-sm font-bold text-white mr-1.5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 disabled:shadow-none flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Results Dropdown */}
                {isSearchOpen && (searchResults.length > 0 || (searchQuery.length >= 2 && !isSearching)) && (
                  <div className="absolute top-full mt-3 left-0 right-0 bg-gradient-to-b from-black/95 via-black/90 to-black/95 backdrop-blur-2xl rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {searchResults.length > 0 ? (
                      <div className="max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-white/5">
                        <div className="p-3 bg-gradient-to-r from-emerald-500/20 via-emerald-600/10 to-green-500/20 border-b border-emerald-500/30 sticky top-0 backdrop-blur-xl z-10">
                          <p className="text-xs text-emerald-300 font-bold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {searchResults.map((result, index) => (
                          <button
                            key={result.id}
                            onClick={() => handleResultClick(result.slug)}
                            className="w-full flex items-center gap-4 p-3.5 hover:bg-gradient-to-r hover:from-emerald-500/20 hover:via-emerald-600/10 hover:to-green-500/20 transition-all duration-200 border-b border-white/5 last:border-0 group relative overflow-hidden"
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Poster */}
                            <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-emerald-500/30 shadow-lg group-hover:border-emerald-400/60 group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105">
                              {result.poster_path ? (
                                <MovieImage
                                  src={tmdbImage(result.poster_path, 'w92')}
                                  alt={result.title}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-900/40 to-green-900/30 flex items-center justify-center">
                                  <Film className="w-5 h-5 text-emerald-500/60" />
                                </div>
                              )}
                            </div>
                            
                            {/* Info */}
                            <div className="flex-1 text-left min-w-0 relative z-10">
                              <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-emerald-300 transition-colors duration-200">
                                {result.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-gray-400 font-medium">{result.release_year}</span>
                                {result.vote_average && (
                                  <>
                                    <span className="text-gray-600">•</span>
                                    <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                      <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                      <span className="text-xs text-emerald-300 font-bold">
                                        {result.vote_average.toFixed(1)}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Category Badge */}
                            <span className={`text-xs px-3 py-1.5 rounded-full border font-bold relative z-10 ${getCategoryColor(result.content_category)}`}>
                              {getCategoryLabel(result.content_category)}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : searchQuery.length >= 2 && !isSearching ? (
                      <div className="p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                          <Search className="w-10 h-10 text-emerald-500/60" />
                        </div>
                        <p className="text-white font-bold mb-2 text-lg">No results found</p>
                        <p className="text-sm text-gray-400">Try searching with different keywords</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`w-11 h-11 rounded-xl backdrop-blur-xl border flex items-center justify-center transition-all duration-300 ${
                  isSearchOpen 
                    ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-500/20 to-green-500/10 text-emerald-300 shadow-lg shadow-emerald-500/30 scale-105' 
                    : 'border-white/10 bg-black/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40'
                }`}
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* Hamburger Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-11 h-11 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isSearchOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-4" ref={searchRef}>
            <div className="flex items-center gap-2 bg-gradient-to-r from-black/70 to-black/50 backdrop-blur-xl border border-emerald-500/40 h-12 rounded-full overflow-hidden shadow-lg shadow-emerald-500/20">
              <div className="pl-5">
                {isSearching ? (
                  <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <input
                type="text"
                placeholder="Search movies, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-full bg-transparent outline-none text-sm text-white placeholder-gray-500 font-medium"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSearchResults([])
                  }}
                  className="hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <button
                type="button"
                onClick={handleSearchSubmit}
                disabled={!searchQuery.trim()}
                className="bg-gradient-to-r from-emerald-500 to-green-600 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed px-5 h-9 rounded-full text-sm font-bold text-white mr-1.5 flex items-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Go</span>
              </button>
            </div>

            {/* Mobile Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-3 bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-2xl rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
                <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-green-500/10 border-b border-emerald-500/20 sticky top-0">
                  <p className="text-xs text-emerald-300 font-bold flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.slug)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/10 transition-all border-b border-white/5 last:border-0 active:scale-98"
                  >
                    <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-emerald-500/30 shadow-md">
                      {result.poster_path ? (
                        <MovieImage
                          src={tmdbImage(result.poster_path, 'w92')}
                          alt={result.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-900/40 to-green-900/30 flex items-center justify-center">
                          <Film className="w-4 h-4 text-emerald-500/60" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-bold text-white text-sm line-clamp-1">{result.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 font-medium">{result.release_year}</span>
                        {result.vote_average && (
                          <>
                            <span className="text-gray-600">•</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                              <span className="text-xs text-emerald-300 font-bold">{result.vote_average.toFixed(1)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full border font-bold ${getCategoryColor(result.content_category)}`}>
                      {getCategoryLabel(result.content_category)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-2xl border-l border-emerald-500/20 shadow-2xl transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-emerald-500/20">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              <span className="text-xl font-black text-white">MovieHub</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-6 space-y-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/10 text-emerald-400 border border-emerald-500/40'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-emerald-500/20' : 'bg-white/5'
                  }`}>
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                  </div>
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Decorative Element */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-600/5 rounded-2xl border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white">Premium Movies</span>
              </div>
              <p className="text-sm text-gray-400">
                Stream & download thousands of movies and TV series in HD quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}