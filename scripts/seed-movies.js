import { MeiliSearch } from 'meilisearch';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MEILISEARCH_URL = process.env.NEXT_PUBLIC_MEILISEARCH_URL || 'http://127.0.0.1:7700';
const MEILISEARCH_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || 'masterKey';

const client = new MeiliSearch({
  host: MEILISEARCH_URL,
  apiKey: MEILISEARCH_KEY,
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
      console.error('Make sure MeiliSearch is running on the correct port (default: 7700)');
      console.error('Error details:', error.message);
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