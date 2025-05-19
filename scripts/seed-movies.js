import { MeiliSearch } from 'meilisearch';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: 'masterKey'
});

async function seedMovies() {
  try {
    // Read movies data
    const moviesData = JSON.parse(
      await readFile(join(__dirname, '../src/data/movies.json'), 'utf-8')
    );

    // Create movies index
    const index = client.index('movies');
    
    // Add documents to the index
    const response = await index.addDocuments(moviesData.movies);
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

// Execute the seed function
seedMovies();