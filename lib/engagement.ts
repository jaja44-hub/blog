import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export type EngagementEventType = "favorite_added" | "favorite_removed" | "like_added" | "like_removed" | "rating_submitted" | "feedback_submitted" | "post_viewed";

export async function recordEngagementEvent(input: {
  eventType: EngagementEventType;
  postSlug: string;
  visitorId?: string;
}) {
  await sql`
    INSERT INTO engagement_events (event_type, post_slug, visitor_identifier)
    VALUES (${input.eventType}, ${input.postSlug}, ${input.visitorId ?? null})
  `;
}

export async function getPopularPostSlugs() {
  const rows = await sql`
    SELECT post_slug, COUNT(*)::int AS event_count
    FROM engagement_events
    WHERE created_at >= NOW() - INTERVAL '90 days'
    GROUP BY post_slug
    ORDER BY event_count DESC, post_slug ASC
  ` as Array<{ post_slug: string; event_count: number }>;

  return new Map(rows.map((row) => [row.post_slug, row.event_count]));
}