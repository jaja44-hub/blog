import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

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