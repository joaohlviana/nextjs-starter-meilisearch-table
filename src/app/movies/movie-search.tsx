"use client"

import { useState, useEffect } from "react"
import { meilisearchClient } from "@/lib/meilisearch"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Movie {
  id: string
  title: string
  overview: string
  poster: string
  rating: number
  year: number
}

export function MovieSearch() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  const searchMovies = async (searchQuery: string) => {
    try {
      const index = meilisearchClient.getIndex("movies")
      const results = await index.search(searchQuery)
      setMovies(results.hits as Movie[])
    } catch (error) {
      console.error("Search error:", error)
      setMovies([])
    }
    setLoading(false)
  }

  useEffect(() => {
    searchMovies("")
  }, [])

  return (
    <div className="space-y-6">
      <Input
        type="search"
        placeholder="Search movies..."
        className="max-w-md"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          searchMovies(e.target.value)
        }}
      />

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={movie.poster || "https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg"}
                  alt={movie.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <span>★ {movie.rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {movie.overview}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}