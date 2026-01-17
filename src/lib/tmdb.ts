/* eslint-disable @typescript-eslint/no-explicit-any */
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || ''
const TMDB_API_BASE = 'https://api.themoviedb.org/3'

export function tmdbImage(
  path?: string | null,
  size: 'w185' | 'w500' | 'w780' | 'w92' | 'original' = 'w500'
) {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

// Search for a movie by title
export async function searchMovie(title: string, year?: number) {
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: title,
      language: 'en-US',
      page: '1',
      include_adult: 'false',
    })

    if (year) {
      params.append('year', year.toString())
    }

    const response = await fetch(
      `${TMDB_API_BASE}/search/movie?${params.toString()}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to search movie')
    }

    const data = await response.json()
    return data.results[0] // Return first result
  } catch (error) {
    console.error('TMDB search error:', error)
    return null
  }
}

// Get movie details by ID with credits and videos
export async function getMovieDetails(movieId: number) {
  try {
    const response = await fetch(
      `${TMDB_API_BASE}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos&language=en-US`
    )
    
    if (!response.ok) {
      throw new Error('Failed to get movie details')
    }

    return await response.json()
  } catch (error) {
    console.error('TMDB details error:', error)
    return null
  }
}

// Get best trailer/video from TMDB videos
export function getBestVideo(videos: any[]) {
  if (!videos || videos.length === 0) return null

  // Priority order for video types
  const priorities = {
    'Trailer': 3,
    'Teaser': 2,
    'Clip': 1,
  }

  // Filter YouTube videos only and sort by priority
  const youtubeVideos = videos
    .filter((video: any) => video.site === 'YouTube')
    .sort((a: any, b: any) => {
      const priorityA = priorities[a.type as keyof typeof priorities] || 0
      const priorityB = priorities[b.type as keyof typeof priorities] || 0
      return priorityB - priorityA
    })

  if (youtubeVideos.length === 0) return null

  const video = youtubeVideos[0]
  
  // Return YouTube embed URL
  return {
    key: video.key,
    name: video.name,
    type: video.type,
    url: `https://www.youtube.com/embed/${video.key}`,
    thumbnail: `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`,
  }
}

// Fetch complete TMDB data including director, cast, videos, etc.
export async function fetchTMDBData(title: string, year?: number) {
  const movie = await searchMovie(title, year)
  
  if (!movie) {
    return null
  }

  // Get full details including credits and videos
  const details = await getMovieDetails(movie.id)
  
  if (!details) {
    return null
  }

  // Extract director from crew
  const director = details.credits?.crew?.find(
    (person: any) => person.job === 'Director'
  )?.name || null

  // Extract top cast (first 10 actors)
  const cast = details.credits?.cast?.slice(0, 10).map((person: any) => ({
    name: person.name,
    character: person.character,
    profile_path: person.profile_path,
    order: person.order,
  })) || []

  // Extract countries
  const countries = details.production_countries?.map((country: any) => country.name) || []

  // Extract genres
  const genres = details.genres?.map((genre: any) => genre.name) || []

  // Get best video (trailer)
  const video = getBestVideo(details.videos?.results || [])

  return {
    // Basic TMDB data
    tmdb_id: details.id,
    imdb_id: details.imdb_id,
    poster_path: details.poster_path,
    backdrop_path: details.backdrop_path,
    overview: details.overview,
    vote_average: details.vote_average,
    vote_count: details.vote_count,
    popularity: details.popularity,
    original_language: details.original_language,
    runtime: details.runtime,
    
    // Credits & Production
    director: director,
    cast: cast,
    countries: countries,
    genres: genres,

    // Video/Trailer
    video: video, // { key, name, type, url, thumbnail }
    preview_link: video?.url || null, // Direct embed URL for iframe
  }
}