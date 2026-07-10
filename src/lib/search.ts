"use client";

export interface SearchResult {
  id: string;
  title: string;
  type: "blog" | "wiki";
  snippet: string;
  score: number;
}

interface EmbeddingEntry {
  id: string;
  title: string;
  type: "blog" | "wiki";
  snippet: string;
  embedding: number[];
}

interface EmbeddingOutput {
  data: Float32Array;
}

type Extractor = (text: string, opts: { pooling: "mean"; normalize: boolean }) => Promise<EmbeddingOutput>;

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
    extractorPromise = (async () => {
      const { pipeline } = await import("@huggingface/transformers");
      const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
      return extractor as unknown as Extractor;
    })();
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

export type SearchFilter = "all" | "blog" | "wiki";

export async function search(
  query: string,
  topK = 10,
  filter: SearchFilter = "all"
): Promise<SearchResult[]> {
  const [docs, extractor] = await Promise.all([loadDocs(), getExtractor()]);

  const output = await extractor(query, { pooling: "mean", normalize: true });
  const queryEmbedding = Array.from(output.data);

  const filtered = filter === "all" ? docs : docs.filter((d) => d.type === filter);

  const scored = filtered.map((doc) => ({
    id: doc.id,
    title: doc.title,
    type: doc.type,
    snippet: doc.snippet,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
