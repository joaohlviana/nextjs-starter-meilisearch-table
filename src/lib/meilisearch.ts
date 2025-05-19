"use client";

import { MeiliSearch, Index } from 'meilisearch';

class MeilisearchClient {
  private static instance: MeilisearchClient;
  private client: MeiliSearch;

  private constructor() {
    const host = process.env.NEXT_PUBLIC_MEILISEARCH_URL;
    const apiKey = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY;

    if (!host) {
      throw new Error('NEXT_PUBLIC_MEILISEARCH_URL is not defined');
    }

    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY is not defined');
    }

    this.client = new MeiliSearch({ 
      host,
      apiKey,
      requestConfig: {
        timeout: 10000 // Add timeout of 10 seconds
      }
    });
  }

  public static getInstance(): MeilisearchClient {
    if (!MeilisearchClient.instance) {
      MeilisearchClient.instance = new MeilisearchClient();
    }

    return MeilisearchClient.instance;
  }

  public getIndex(index: string): Index {
    return this.client.index(index);
  }

  public async health() {
    try {
      return await this.client.health();
    } catch (error) {
      console.error('MeiliSearch health check failed:', error);
      throw error;
    }
  }
}

export const meilisearchClient = MeilisearchClient.getInstance();