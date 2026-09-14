import { google, blogger_v3, Auth } from "googleapis";

export interface BloggerConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  blogId?: string;
}

export interface TokenSet {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
  token_type: string;
  scope: string;
}

let cachedClient: blogger_v3.Blogger | null = null;
let cachedOAuth2Client: Auth.OAuth2Client | null = null;

export function createOAuth2Client(config: BloggerConfig) {
  return new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );
}

export function getOAuth2Client(config: BloggerConfig) {
  if (!cachedOAuth2Client) {
    cachedOAuth2Client = createOAuth2Client(config);
  }
  return cachedOAuth2Client;
}

export function setCredentials(oauth2Client: Auth.OAuth2Client, tokens: TokenSet) {
  oauth2Client.setCredentials(tokens);
}

export function getBloggerClient(config: BloggerConfig, tokens: TokenSet) {
  const oauth2Client = getOAuth2Client(config);
  setCredentials(oauth2Client, tokens);
  
  if (!cachedClient) {
    cachedClient = google.blogger({ version: "v3", auth: oauth2Client });
  }
  return cachedClient;
}

export function generateAuthUrl(config: BloggerConfig, scopes: string[] = [
  "https://www.googleapis.com/auth/blogger",
  "https://www.googleapis.com/auth/blogger.readonly"
]) {
  const oauth2Client = getOAuth2Client(config);
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
}

export async function refreshAccessToken(config: BloggerConfig, refreshToken: string): Promise<TokenSet> {
  const oauth2Client = getOAuth2Client(config);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  
  const { credentials } = await oauth2Client.refreshAccessToken();
  
  return {
    access_token: credentials.access_token!,
    refresh_token: credentials.refresh_token || refreshToken,
    expiry_date: credentials.expiry_date!,
    token_type: credentials.token_type!,
    scope: credentials.scope!,
  };
}

export async function getValidTokens(config: BloggerConfig, storedTokens: TokenSet): Promise<TokenSet> {
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5 minute buffer
  
  if (storedTokens.expiry_date > now + bufferMs) {
    return storedTokens;
  }
  
  return refreshAccessToken(config, storedTokens.refresh_token);
}