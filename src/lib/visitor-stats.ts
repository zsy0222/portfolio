import { createHash } from "node:crypto";
import { firstValue, tursoQuery } from "@/lib/turso";

const dayMs = 24 * 60 * 60 * 1000;
const sessionGapMs = 30 * 60 * 1000;

export const browserIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const visitorReportDays = 30;
const retentionDays = 90;

const asText = (value: string) => ({ type: "text", value });
const asInteger = (value: number) => ({ type: "integer", value: String(value) });

function shanghaiDay(timestamp: number) {
  return new Date(timestamp + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function query(...args: Parameters<typeof tursoQuery>) {
  const result = await tursoQuery(...args);
  if (result.results[0]?.type !== "ok") throw new Error("Visitor statistics query failed");
  return result;
}

let setup: Promise<unknown> | undefined;
let cleanedDay = "";
let cleanup: Promise<unknown> | undefined;

async function prepare(now: number) {
  setup ??= query(`
    CREATE TABLE IF NOT EXISTS visitor_activity (
      day TEXT NOT NULL,
      browser_key TEXT NOT NULL,
      last_seen INTEGER NOT NULL,
      visits INTEGER NOT NULL,
      PRIMARY KEY (day, browser_key)
    )
  `).catch((error) => {
    setup = undefined;
    throw error;
  });
  await setup;

  const today = shanghaiDay(now);
  if (cleanedDay === today) return;
  cleanup ??= query("DELETE FROM visitor_activity WHERE day < ?", [
    asText(shanghaiDay(now - (retentionDays - 1) * dayMs)),
  ]).then(() => {
    cleanedDay = today;
  }).finally(() => {
    cleanup = undefined;
  });
  await cleanup;
}

export async function recordVisit(browserId: string, now = Date.now()) {
  await prepare(now);
  const key = createHash("sha256").update(browserId).digest("hex");
  await query(`
    INSERT INTO visitor_activity (day, browser_key, last_seen, visits)
    VALUES (?, ?, ?, 1)
    ON CONFLICT (day, browser_key) DO UPDATE SET
      visits = visitor_activity.visits + (visitor_activity.last_seen <= excluded.last_seen - ?),
      last_seen = MAX(visitor_activity.last_seen, excluded.last_seen)
  `, [asText(shanghaiDay(now)), asText(key), asInteger(now), asInteger(sessionGapMs)]);
}

export async function readVisitorStats(now = Date.now()) {
  await prepare(now);
  const result = await query(`
    WITH browser_totals AS (
      SELECT SUM(visits) AS all_visits,
             SUM(CASE WHEN day >= ? THEN visits ELSE 0 END) AS recent_visits
      FROM visitor_activity
      WHERE day BETWEEN ? AND ?
      GROUP BY browser_key
    )
    SELECT COUNT(*),
           COALESCE(SUM(all_visits > 1), 0),
           COALESCE(SUM(recent_visits), 0)
    FROM browser_totals
    WHERE recent_visits > 0
  `, [
    asText(shanghaiDay(now - (visitorReportDays - 1) * dayMs)),
    asText(shanghaiDay(now - (retentionDays - 1) * dayMs)),
    asText(shanghaiDay(now)),
  ]);
  return {
    browsers: Number(firstValue(result, 0)),
    returning: Number(firstValue(result, 1)),
    visits: Number(firstValue(result, 2)),
  };
}
