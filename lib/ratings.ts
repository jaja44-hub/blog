import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function initRatingsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS post_ratings (
      id SERIAL PRIMARY KEY,
      post_slug VARCHAR(255) NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      user_identifier VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(post_slug, user_identifier)
    );
  `;
  
  await sql`
    CREATE INDEX IF NOT EXISTS idx_post_ratings_post_slug ON post_ratings(post_slug);
  `;
}

export async function getPostRating(postSlug: string) {
  const result = await sql`
    SELECT 
      AVG(rating)::numeric(3,2) as average_rating,
      COUNT(*) as total_ratings
    FROM post_ratings
    WHERE post_slug = ${postSlug}
  `;
  
  return result[0] || { average_rating: 0, total_ratings: 0 };
}

export async function getUserRating(postSlug: string, userIdentifier: string) {
  const result = await sql`
    SELECT rating FROM post_ratings
    WHERE post_slug = ${postSlug} AND user_identifier = ${userIdentifier}
  `;
  
  return result[0]?.rating || null;
}

export async function setUserRating(postSlug: string, userIdentifier: string, rating: number) {
  await sql`
    INSERT INTO post_ratings (post_slug, rating, user_identifier)
    VALUES (${postSlug}, ${rating}, ${userIdentifier})
    ON CONFLICT (post_slug, user_identifier) 
    DO UPDATE SET rating = ${rating}, created_at = NOW()
  `;
}