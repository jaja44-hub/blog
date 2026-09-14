import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "addis_admin_session";

function getAccessToken() {
  const token = process.env.ADMIN_ACCESS_TOKEN;
  if (!token) {
    throw new Error("ADMIN_ACCESS_TOKEN is not configured");
  }
  return token;
}

function expectedSession() {
  return createHmac("sha256", getAccessToken()).update("admin-session").digest("hex");
}

export function isValidAdminToken(token: string) {
  const expected = getAccessToken();
  const received = Buffer.from(token);
  const configured = Buffer.from(expected);
  return received.length === configured.length && timingSafeEqual(received, configured);
}

export async function hasAdminSession() {
  const session = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!session) return false;

  const expected = Buffer.from(expectedSession());
  const received = Buffer.from(session);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export { ADMIN_COOKIE, expectedSession };