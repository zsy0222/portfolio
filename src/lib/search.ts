"use client";

import { pipeline } from "@huggingface/transformers";

export interface SearchResult {
  id: string;
  title: string;
  score: number;
}

interface EmbeddingEntry {
  id: string;
  title: string;
  embedding: number[];
}

type Extractor = Awaited<ReturnType<typeof pipeline>>;

interface EmbeddingOutput {
  data: Float32Array;
}

let cachedDocs: EmbeddingEntry[] | null = null;
let extractorPromise: Promise<Extractor> | null = null;

async function loadDocs(): Promise<EmbeddingEntry[]> {
  if (cachedDocs) return cachedDocs;
  const res = await fetch("/embeddings.json");
  const data = await res.json();
  cachedDocs = data;
  return data;
}

async function getExtractor(): Promise<Extractor> {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2") as Promise<Extractor>;
  }
  return extractorPromise;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function search(query: string, topK = 5): Promise<SearchResult[]> {
  const [docs, extractor] = await Promise.all([loadDocs(), getExtractor()]);

  const output = (await (extractor as unknown as (text: string, opts: { pooling: "mean"; normalize: boolean }) => Promise<EmbeddingOutput>)(query, { pooling: "mean", normalize: true })) as EmbeddingOutput;
  const queryEmbedding = Array.from(output.data);

  const scored = docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
