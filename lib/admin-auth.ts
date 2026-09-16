import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "addis_admin_session";
const NEXTAUTH_SESSION_COOKIE = "next-auth.session-token";

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

// Check if user has any valid admin session (token or NextAuth)
export async function hasAnyAdminSession() {
  // Check token-based session first
  if (await hasAdminSession()) return { authenticated: true, method: 'token' };
  
  // Check NextAuth session
  const nextAuthSession = (await cookies()).get(NEXTAUTH_SESSION_COOKIE)?.value;
  if (nextAuthSession) return { authenticated: true, method: 'nextauth' };
  
  return { authenticated: false, method: null };
}

export { ADMIN_COOKIE, expectedSession };