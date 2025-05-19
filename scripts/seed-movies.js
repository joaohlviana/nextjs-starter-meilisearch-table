import { MeiliSearch } from 'meilisearch';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new MeiliSearch({
  host: 'http://localhost:3000',
  apiKey: 'masterKey',
  requestConfig: {
    timeout: 10000 // Add timeout of 10 seconds
  }
});

async function seedMovies() {
  try {
    // Check server health before proceeding
    try {
      await client.health();
      console.log('MeiliSearch server is healthy');
    } catch (error) {
      console.error('MeiliSearch server is not running or not accessible. Please start the server first.');
      process.exit(1);
    }

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
    process.exit(1);
  }
}

// Execute the seed function
seedMovies();