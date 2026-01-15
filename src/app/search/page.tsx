import { supabase } from '@/lib/supabase'
import MovieCard from '@/components/MovieCard'
import MovieFilters from '@/components/MovieFilters'


interface Props {
  searchParams: {
    genre?: string
    year?: string
    rating?: string
  }
}

export default async function SearchPage({ searchParams }: Props) {
  let query = supabase.from('movies').select('*')

  if (searchParams.genre) {
    query = query.contains('genres', [searchParams.genre])
  }

  if (searchParams.year) {
    query = query.eq('release_year', Number(searchParams.year))
  }

  if (searchParams.rating) {
    query = query.gte('rating', Number(searchParams.rating))
  }

  const { data: movies, error } = await query.order('created_at', {
    ascending: false,
  })

  if (error) {
    return <p className="text-red-500">Error loading movies</p>
  }

  return (
    <div className="p-6">
      <MovieFilters />
      <h1 className="text-2xl font-bold mb-6 text-white">
        Search Results
      </h1>

      {movies?.length === 0 && (
        <p className="text-gray-400">No movies found</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies?.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}
