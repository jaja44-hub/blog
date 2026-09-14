# Blogger API Programmatic Access Setup Guide

This guide walks you through setting up programmatic access to your Blogger blog using the Blogger API v3.

## Prerequisites

- A Google account that owns the Blogger blog
- A Google Cloud project (or create a new one)
- This Next.js project running locally or deployed

---

## Step 1: Create Google Cloud Project & Enable Blogger API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Library**
4. Search for "Blogger API" and click **Enable**

---

## Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. If prompted, configure the **OAuth consent screen**:
   - User Type: **External** (or Internal if using Google Workspace)
   - App name: `Addis Crown Blogger Integration`
   - Authorized domains: `yourdomain.com` (add your production domain)
   - Scopes: Add `https://www.googleapis.com/auth/blogger` and `https://www.googleapis.com/auth/blogger.readonly`
   - Test users: Add your Google account email
4. For **Application type**, select **Web application**
5. Name: `Addis Crown Blogger Client`
6. **Authorized redirect URIs** (add both):
   - Development: `http://localhost:3000/api/blogger/callback`
   - Production: `https://yourdomain.com/api/blogger/callback`
7. Click **Create**
8. **Copy the Client ID and Client Secret** - you'll need these

---

## Step 3: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.blogger.example .env.local
   ```

2. Edit `.env.local` and fill in:
   ```env
   BLOGGER_CLIENT_ID=your-client-id.apps.googleusercontent.com
   BLOGGER_CLIENT_SECRET=your-client-secret
   BLOGGER_REDIRECT_URI=http://localhost:3000/api/blogger/callback
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Step 4: Complete OAuth Flow (One-Time Setup)

### Option A: Using the Admin UI (Recommended)

1. Navigate to `http://localhost:3000/admin/blogger` (you'll need to create this page)
2. Click "Connect to Blogger"
3. Sign in with the Google account that owns the blog
4. Grant permissions
5. You'll be redirected back with the tokens

### Option B: Using API Directly

1. **Get Authorization URL:**
   ```bash
   curl http://localhost:3000/api/blogger/auth
   ```
   Response: `{ "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..." }`

2. **Open the authUrl in your browser** and complete consent

3. **Handle Callback:**
   The callback at `/api/blogger/callback` will exchange the code for tokens and return:
   ```json
   {
     "success": true,
     "tokens": { "access_token": "...", "refresh_token": "...", ... },
     "blogs": [{ "id": "123456789", "name": "Addis Crown", "url": "https://addiscrown.blogspot.com" }, ...]
   }
   ```

4. **Copy the `tokens` JSON and your chosen blog's `id`**

5. **Update `.env.local`:**
   ```env
   BLOGGER_BLOG_ID=1234567890123456789
   BLOGGER_TOKENS={"access_token":"ya29...","refresh_token":"1//...","expiry_date":1234567890123,"token_type":"Bearer","scope":"https://www.googleapis.com/auth/blogger https://www.googleapis.com/auth/blogger.readonly"}
   ```

6. **Restart the dev server** to pick up the new env vars

---

## Step 5: Verify the Setup

Test the API endpoints:

```bash
# List your blogs
curl http://localhost:3000/api/blogger/user?action=blogs

# Get blog info
curl http://localhost:3000/api/blogger/blog

# List posts
curl http://localhost:3000/api/blogger/posts

# Create a test post
curl -X POST http://localhost:3000/api/blogger/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"<p>Hello from API!</p>","labels":["Test"],"isDraft":true}'
```

---

## Step 6: Production Deployment

For Vercel deployment:

1. Add the same environment variables in **Vercel Dashboard > Settings > Environment Variables**
2. Update `BLOGGER_REDIRECT_URI` to your production URL:
   ```env
   BLOGGER_REDIRECT_URI=https://yourdomain.com/api/blogger/callback
   ```
3. Update the OAuth consent screen authorized domains and redirect URIs in Google Cloud Console
4. Redeploy

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogger/auth` | Get OAuth authorization URL |
| GET | `/api/blogger/callback` | OAuth callback (handles code exchange) |
| GET | `/api/blogger/user` | Get authenticated user info |
| GET | `/api/blogger/user?action=blogs` | List user's blogs |
| GET | `/api/blogger/blog` | Get configured blog info |
| GET | `/api/blogger/blog?url=...` | Get blog by URL |
| GET | `/api/blogger/posts` | List posts (query: maxResults, status, labels, pageToken) |
| POST | `/api/blogger/posts` | Create post (body: title, content, labels, isDraft) |
| GET | `/api/blogger/posts/:postId` | Get single post |
| PATCH | `/api/blogger/posts/:postId` | Update post |
| DELETE | `/api/blogger/posts/:postId` | Delete post |
| GET | `/api/blogger/pages` | List pages |
| POST | `/api/blogger/pages` | Create page |
| GET | `/api/blogger/pages/:pageId` | Get single page |
| PATCH | `/api/blogger/pages/:pageId` | Update page |
| DELETE | `/api/blogger/pages/:pageId` | Delete page |
| GET | `/api/blogger/comments?postId=...` | List comments for a post |
| PATCH | `/api/blogger/comments/:commentId` | Moderate comment (body: action, postId) |

---

## Token Refresh

The system automatically refreshes access tokens when they expire (5-minute buffer). The `refresh_token` is long-lived and only needs to be re-obtained if:
- User revokes access in Google Account settings
- Token hasn't been used for 6 months
- You change OAuth client credentials

---

## Security Notes

- **Never commit `.env.local`** - it's in `.gitignore`
- Store `BLOGGER_TOKENS` securely in production (Vercel encrypted env vars)
- The `refresh_token` grants ongoing access - treat it like a password
- Use least-privilege scopes (we request `blogger` + `blogger.readonly`)

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `redirect_uri_mismatch` | Ensure redirect URI in Google Cloud Console matches `BLOGGER_REDIRECT_URI` exactly |
| `access_denied` | User didn't grant consent; ensure test user is added in OAuth consent screen |
| `invalid_grant` | Refresh token expired/revoked; re-run OAuth flow |
| `Blog ID not configured` | Set `BLOGGER_BLOG_ID` after getting blog list from `/api/blogger/user?action=blogs` |
| `403 Forbidden` | Blogger API not enabled in Google Cloud project |

---

## Next Steps

With the API configured, you can now:
- Sync posts from your Next.js admin to Blogger
- Manage comments programmatically
- Build custom publishing workflows
- Create a hybrid architecture (Next.js for app features, Blogger for public SEO/monetization)

See `BLOGGER_HYBRID_ARCHITECTURE_DRAFT.md` for architecture decisions.