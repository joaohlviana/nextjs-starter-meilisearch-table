import { MeiliSearch } from 'meilisearch';
import movies from '../src/data/movies.json';

const client = new MeiliSearch({
  host: 'http://localhost:3000',
  apiKey: 'masterKey' // Default master key if not changed
});

async function seedMovies() {
  try {
    // Create movies index
    const index = client.index('movies');
    
    // Add documents to the index
    const response = await index.addDocuments(movies.movies);
    console.log('Movies added successfully:', response);

    // Configure searchable attributes
    await index.updateSearchableAttributes([
      'title',
      'overview'
    ]);

    // Configure filterable attributes
    await index.updateFilterableAttributes([
      'year',
      'rating'
    ]);

    console.log('Meilisearch setup completed successfully!');
  } catch (error) {
    console.error('Error seeding movies:', error);
  }
}

seedMovies();