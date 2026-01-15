/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { extractDriveFileId, generateDriveLinks } from '@/lib/googleDrive'
import { fetchTMDBData } from '@/lib/tmdb'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AddMoviePage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [driveLink, setDriveLink] = useState('')
  
  // 🎬 Multiple Resolution Links
  const [resolutionLinks, setResolutionLinks] = useState([
    { resolution: '1080p', link: '' },
    { resolution: '720p', link: '' },
    { resolution: '480p', link: '' },
    { resolution: '360p', link: '' }
  ])
  
  // Custom fields (not from TMDB)
  const [subtitleBy, setSubtitleBy] = useState('')
  const [webdl, setWebdl] = useState('')
  const [languageCategory, setLanguageCategory] = useState('')
  const [contentCategory, setContentCategory] = useState('') // 🎬 New: Content Category
  
  const [loading, setLoading] = useState(false)
  const [fetchingTMDB, setFetchingTMDB] = useState(false)
  const [error, setError] = useState('')
  const [tmdbData, setTmdbData] = useState<any>(null)

  const handleFetchTMDB = async () => {
    if (!title) {
      setError('Please enter a movie title first')
      return
    }

    setFetchingTMDB(true)
    setError('')

    const data = await fetchTMDBData(title, year ? Number(year) : undefined)

    if (!data) {
      setError('Movie not found on TMDB. You can still add it manually.')
      setFetchingTMDB(false)
      return
    }

    setTmdbData(data)
    setFetchingTMDB(false)
  }

  const handleSubmit = async () => {
    if (!title || !year || !contentCategory) {
      setError('Please fill in all required fields')
      return
    }

    // Check if at least one resolution link is provided
    const hasAtLeastOneLink = resolutionLinks.some(r => r.link.trim() !== '')
    if (!hasAtLeastOneLink) {
      setError('Please provide at least one resolution link')
      return
    }

    setLoading(true)
    setError('')

    // Process resolution links
    const processedResolutions: any = {}
    for (const res of resolutionLinks) {
      if (res.link.trim()) {
        const fileId = extractDriveFileId(res.link)
        if (fileId) {
          const { preview, download } = generateDriveLinks(fileId)
          processedResolutions[res.resolution] = {
            file_id: fileId,
            preview_url: preview,
            download_url: download
          }
        }
      }
    }

    // Use the first available resolution as the default video_url
    const firstResolution = Object.values(processedResolutions)[0] as any
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    const movieData: any = {
      title,
      release_year: Number(year),
      video_url: firstResolution.preview_url,
      download_link: firstResolution.download_url,
      resolution_links: processedResolutions, // 🎬 Store all resolution links
      slug,
      
      // Custom fields
      subtitle_by: subtitleBy || null,
      webdl: webdl || null,
      language_category: languageCategory || null,
      content_category: contentCategory,
    }

    // Add TMDB data if available
    if (tmdbData) {
      if (tmdbData.tmdb_id) movieData.tmdb_id = tmdbData.tmdb_id
      if (tmdbData.imdb_id) movieData.imdb_id = tmdbData.imdb_id
      if (tmdbData.poster_path) movieData.poster_path = tmdbData.poster_path
      if (tmdbData.backdrop_path) movieData.backdrop_path = tmdbData.backdrop_path
      if (tmdbData.overview) movieData.overview = tmdbData.overview
      if (tmdbData.vote_average) movieData.vote_average = tmdbData.vote_average
      if (tmdbData.vote_count) movieData.vote_count = tmdbData.vote_count
      if (tmdbData.popularity) movieData.popularity = tmdbData.popularity
      if (tmdbData.original_language) movieData.original_language = tmdbData.original_language
      if (tmdbData.runtime) movieData.runtime = tmdbData.runtime
      if (tmdbData.director) movieData.director = tmdbData.director
      if (tmdbData.cast && tmdbData.cast.length > 0) movieData.cast = tmdbData.cast
      if (tmdbData.countries && tmdbData.countries.length > 0) movieData.countries = tmdbData.countries
      if (tmdbData.genres && tmdbData.genres.length > 0) movieData.genres = tmdbData.genres
      if (tmdbData.preview_link) movieData.preview_link = tmdbData.preview_link
    }

    const { error: insertError } = await supabase
      .from('movies')
      .insert(movieData)

    if (insertError) {
      console.error('Insert error:', insertError)
      setError('Failed to save movie: ' + insertError.message)
      setLoading(false)
      return
    }

    router.push('/admin/movies')
  }

  return (
    <div className="p-8 text-white">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Add New Movie</h1>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* TMDB Data Section */}
            <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-purple-400">🎬</span>
                TMDB Data (Auto-fetch)
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Movie Title *
                  </label>
                  <input
                    placeholder="e.g. Jurassic World Rebirth"
                    className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Release Year *
                  </label>
                  <input
                    type="number"
                    placeholder="2025"
                    className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleFetchTMDB}
                  disabled={!title || fetchingTMDB}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {fetchingTMDB ? 'Fetching from TMDB...' : '🎬 Fetch Movie Data from TMDB'}
                </button>
              </div>
            </div>

            {/* Custom Fields Section */}
            <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-400">✏️</span>
                Custom Details
              </h2>

              <div className="space-y-4">
                {/* 🎬 New: Content Category */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Content Category * <span className="text-red-400">(Required)</span>
                  </label>
                  <select
                    className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={contentCategory}
                    onChange={(e) => setContentCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    <option value="MOVIE">🎬 Movie</option>
                    <option value="TV_SERIES">📺 TV Series</option>
                    <option value="CARTOON">🎨 Cartoon</option>
                    <option value="ANIME">⚡ Anime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Subtitle By
                  </label>
                  <input
                    placeholder="e.g. රුක්මාන් සේනානායක (Cinerulk)"
                    className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={subtitleBy}
                    onChange={(e) => setSubtitleBy(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    WEBDL
                  </label>
                  <input
                    placeholder="e.g. WEBDL"
                    className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={webdl}
                    onChange={(e) => setWebdl(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Language Category
                  </label>
                  <select
                    className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={languageCategory}
                    onChange={(e) => setLanguageCategory(e.target.value)}
                  >
                    <option value="">Select language</option>
                    <option value="TELUGU">TELUGU</option>
                    <option value="HINDI">HINDI</option>
                    <option value="TAMIL">TAMIL</option>
                    <option value="ENGLISH">ENGLISH</option>
                    <option value="SINHALA">SINHALA</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Drive Link Section */}
            <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-green-400">📁</span>
                Google Drive Links (Multiple Resolutions)
              </h2>

              <div className="space-y-4">
                {resolutionLinks.map((item, index) => (
                  <div key={item.resolution}>
                    <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                      <span className="font-semibold text-blue-400">{item.resolution}</span>
                      {index === 0 && <span className="text-xs text-green-400">(At least one required)</span>}
                    </label>
                    <input
                      placeholder={`https://drive.google.com/file/d/... (${item.resolution})`}
                      className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.link}
                      onChange={(e) => {
                        const newLinks = [...resolutionLinks]
                        newLinks[index].link = e.target.value
                        setResolutionLinks(newLinks)
                      }}
                    />
                  </div>
                ))}
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
                  <p className="text-xs text-blue-300">
                    💡 <strong>Tip:</strong> Add multiple resolution options to give users flexibility. 
                    At least one resolution link is required.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !title || !year || !contentCategory}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Movie'}
              </button>

              <button
                onClick={() => router.push('/admin/movies')}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-[#020617] border border-gray-800 rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>

              {/* 🎬 Show selected category */}
              {contentCategory && (
                <div className="mb-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Content Type:</div>
                  <div className="text-lg font-bold">
                    {contentCategory === 'MOVIE' && '🎬 Movie'}
                    {contentCategory === 'TV_SERIES' && '📺 TV Series'}
                    {contentCategory === 'CARTOON' && '🎨 Cartoon'}
                    {contentCategory === 'ANIME' && '⚡ Anime'}
                  </div>
                </div>
              )}

              {tmdbData ? (
                <div className="space-y-4">
                  {/* Poster */}
                  {tmdbData.poster_path && (
                    <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Video/Trailer Preview */}
                  {tmdbData.video && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-red-500">🎬</span>
                        <span className="text-gray-400">Trailer Available:</span>
                        <span className="text-green-400 font-semibold">{tmdbData.video.type}</span>
                      </div>
                      {tmdbData.video.thumbnail && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                          <Image
                            src={tmdbData.video.thumbnail}
                            alt="Video thumbnail"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TMDB Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-semibold">{tmdbData.vote_average?.toFixed(1)}</span>
                      <span className="text-gray-400">({tmdbData.vote_count} votes)</span>
                    </div>

                    {tmdbData.runtime && (
                      <div>
                        <span className="text-gray-400">Runtime:</span>
                        <span className="ml-2 font-semibold">{tmdbData.runtime} min</span>
                      </div>
                    )}

                    {tmdbData.director && (
                      <div>
                        <span className="text-gray-400">Director:</span>
                        <span className="ml-2 font-semibold">{tmdbData.director}</span>
                      </div>
                    )}

                    {tmdbData.countries && tmdbData.countries.length > 0 && (
                      <div>
                        <span className="text-gray-400">Countries:</span>
                        <p className="mt-1 font-semibold">{tmdbData.countries.join(', ')}</p>
                      </div>
                    )}

                    {tmdbData.genres && tmdbData.genres.length > 0 && (
                      <div>
                        <span className="text-gray-400">Genres:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {tmdbData.genres.map((genre: string) => (
                            <span key={genre} className="px-2 py-1 bg-blue-600/20 rounded text-xs">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {tmdbData.cast && tmdbData.cast.length > 0 && (
                      <div>
                        <span className="text-gray-400">Cast:</span>
                        <p className="mt-1 text-xs text-gray-300 line-clamp-3">
                          {tmdbData.cast.map((actor: any) => actor.name).join(', ')}
                        </p>
                      </div>
                    )}

                    {tmdbData.overview && (
                      <div>
                        <span className="text-gray-400">Overview:</span>
                        <p className="mt-1 text-gray-300 line-clamp-4 text-xs">
                          {tmdbData.overview}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 opacity-50"
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
                  <p>Enter a movie title and click</p>
                  <p className="font-medium">&quot;Fetch Movie Data&quot;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}