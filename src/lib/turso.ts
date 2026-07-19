/**
 * Turso HTTP REST API helper — works on any platform without @libsql/client.
 */

interface TursoRowValue {
  type: string;
  value: string;
}

interface TursoResult {
  results: Array<{
    type: string;
    response?: {
      type: string;
      result?: {
        cols: Array<{ name: string }>;
        rows: Array<TursoRowValue[]>;
      };
    };
  }>;
}

const base = (process.env.TURSO_DB_URL || "").replace(/\/v2\/pipeline\/?$/, "");
const token = process.env.TURSO_AUTH_TOKEN || "";

export function hasDb(): boolean {
  return !!(base && token);
}

export async function tursoQuery(sql: string, params: TursoRowValue[] = []): Promise<TursoResult> {
  const res = await fetch(`${base}/v2/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        params.length
          ? { type: "execute", stmt: { sql, args: params } }
          : { type: "execute", stmt: { sql } },
        { type: "close" },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso ${res.status}: ${text}`);
  }
  return res.json() as Promise<TursoResult>;
}

/** Extract first column of all rows as flat array of strings (parsed via value) */
export function columnValues(result: TursoResult, colIndex = 0): string[] {
  const rows = result.results[0]?.response?.result?.rows ?? [];
  return rows.map((row) => row[colIndex]?.value ?? "");
}

/** Extract first column of first row as string */
export function firstValue(result: TursoResult, colIndex = 0): string {
  return columnValues(result, colIndex)[0] ?? "";
}

/** Extract raw rows as array of value objects */
export function allRows(result: TursoResult): Array<Record<string, string>> {
  const cols = result.results[0]?.response?.result?.cols ?? [];
  const rows = result.results[0]?.response?.result?.rows ?? [];
  return rows.map((row) => {
    const obj: Record<string, string> = {};
    row.forEach((val, i) => {
      obj[cols[i]?.name ?? `col${i}`] = val.value;
    });
    return obj;
  });
}
