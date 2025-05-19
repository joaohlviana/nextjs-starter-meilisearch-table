"use client"

import { useState, useEffect } from "react"
import { meilisearchClient } from "@/lib/meilisearch"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Organization } from "../columns"

interface Movie {
  id: string
  title: string
  overview: string
  poster: string
  rating: number
  year: number
}

export function DatabaseItems() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllItems() {
      try {
        const orgIndex = meilisearchClient.getIndex("organizations")
        const movieIndex = meilisearchClient.getIndex("movies")

        const [orgResults, movieResults] = await Promise.all([
          orgIndex.search("", { limit: 100 }),
          movieIndex.search("", { limit: 100 })
        ])

        setOrganizations(orgResults.hits as Organization[])
        setMovies(movieResults.hits as Movie[])
        setError(null)
      } catch (err) {
        setError("Failed to fetch items. Please ensure Meilisearch is running and properly configured.")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllItems()
  }, [])

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-red-500 mb-4 p-4 border border-red-200 rounded-md bg-red-50">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Organizations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <Card key={org.uuid}>
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{org.short_description}</p>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    {org.country_code}
                  </span>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    {org.roles}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <Card key={movie.id}>
              <div className="aspect-video relative">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <span>★ {movie.rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{movie.overview}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}