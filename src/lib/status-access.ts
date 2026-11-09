import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const statusCookie = "portfolio-status-access";
export const statusCookiePath = "/api/status/visitors";
export const statusSessionSeconds = 4 * 60 * 60;

// This digest is for a randomly generated 192-bit report access code.
const reportCodeDigest = "2fdd58bdb4d80faffd32ded40a36398e187b42c766140488c8e95d36529036c7";

export function matchesReportCode(code: unknown) {
  if (typeof code !== "string" || !/^[A-Za-z0-9_-]{32}$/.test(code)) return false;
  const digest = createHash("sha256").update(code).digest();
  return timingSafeEqual(digest, Buffer.from(reportCodeDigest, "hex"));
}

function sign(expiry: string) {
  const secret = process.env.TURSO_AUTH_TOKEN;
  if (!secret) return null;
  return createHmac("sha256", secret).update(`status-visitors:${reportCodeDigest}:${expiry}`).digest("hex");
}

export function issueStatusAccess() {
  const expiry = String(Date.now() + statusSessionSeconds * 1000);
  const signature = sign(expiry);
  return signature ? `${expiry}.${signature}` : null;
}

export function hasStatusAccess(value: string | undefined) {
  const match = /^(\d{13})\.([0-9a-f]{64})$/.exec(value ?? "");
  if (!match || Number(match[1]) <= Date.now()) return false;
  const expected = sign(match[1]);
  return expected !== null && timingSafeEqual(Buffer.from(match[2], "hex"), Buffer.from(expected, "hex"));
}
