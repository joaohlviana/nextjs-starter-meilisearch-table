"use client";

import { MeiliSearch, Index } from 'meilisearch';

class MeilisearchClient {
  private static instance: MeilisearchClient;
  private client: MeiliSearch;

  private constructor() {
    const host = process.env.NEXT_PUBLIC_MEILISEARCH_URL;
    const apiKey = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY;
    this.client = new MeiliSearch({ 
      host: host || 'http://localhost:7700',
      apiKey: apiKey || 'masterKey'
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
    return this.client.health();
  }
}

export const meilisearchClient = MeilisearchClient.getInstance();