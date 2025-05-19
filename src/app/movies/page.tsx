import { MovieSearch } from "./movie-search"

export default function MoviesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Movie Search</h1>
      <MovieSearch />
    </div>
  )
}