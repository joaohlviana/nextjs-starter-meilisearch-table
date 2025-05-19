import { MovieSearch } from "./movies/movie-search"

export default function HomePage() {
  return(
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Movie Search</h1>
      <div className="mb-4">
        <p className="text-muted-foreground">
          Search through our collection of movies. Results update as you type.
        </p>
      </div>
      <MovieSearch />
    </div>
  )