import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

let _db: LibSQLDatabase | null = null;

export function getDb(): LibSQLDatabase | null {
  if (!process.env.TURSO_DB_URL || !process.env.TURSO_AUTH_TOKEN) return null;
  if (!_db) {
    const turso = createClient({
      url: process.env.TURSO_DB_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    _db = drizzle(turso);
  }
  return _db;
}

// Proxy: lazy resolve, returns null-safe wrapper for build-time safety
function getDbOrThrow(): LibSQLDatabase {
  const real = getDb();
  if (!real) throw new Error("Database not configured: TURSO_DB_URL and TURSO_AUTH_TOKEN required");
  return real;
}

export const db: LibSQLDatabase = new Proxy({} as LibSQLDatabase, {
  get(_target, prop: string | symbol) {
    const real = getDbOrThrow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (real as any)[prop];
    if (typeof val === "function") {
      return val.bind(real);
    }
    return val;
  },
});
