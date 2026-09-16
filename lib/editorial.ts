import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export type EditorialPostStatus =
  | "draft"
  | "in_review"
  | "scheduled"
  | "published"
  | "archived";

export type EditorialPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  body_markdown: string;
  status: EditorialPostStatus;
  series_id: string | null;
  author_id: string | null;
  published_at: string | null;
  scheduled_for: string | null;
  created_at: string;
  updated_at: string;
};

export async function listEditorialPosts(status?: EditorialPostStatus) {
  if (status) {
    return (await sql`
      SELECT *
      FROM editorial_posts
      WHERE status = ${status}
      ORDER BY updated_at DESC
    `) as EditorialPost[];
  }

  return (await sql`
    SELECT *
    FROM editorial_posts
    ORDER BY updated_at DESC
  `) as EditorialPost[];
}

export async function getEditorialPostBySlug(slug: string) {
  const posts = (await sql`
    SELECT *
    FROM editorial_posts
    WHERE slug = ${slug}
    LIMIT 1
  `) as EditorialPost[];

  return posts[0] ?? null;
}

export async function createEditorialDraft(input: {
  slug: string;
  title: string;
  description?: string;
  category: string;
  bodyMarkdown?: string;
  authorId?: string;
  seriesId?: string;
}) {
  const posts = (await sql`
    INSERT INTO editorial_posts (
      slug,
      title,
      description,
      category,
      body_markdown,
      author_id,
      series_id
    )
    VALUES (
      ${input.slug},
      ${input.title},
      ${input.description ?? ""},
      ${input.category},
      ${input.bodyMarkdown ?? ""},
      ${input.authorId ?? null},
      ${input.seriesId ?? null}
    )
    RETURNING *
  `) as EditorialPost[];

  return posts[0];
}

export async function updateEditorialPost(
  postId: string,
  input: {
    title: string;
    slug: string;
    description: string;
    category: string;
    bodyMarkdown: string;
    actorId?: string;
  }
) {
  const posts = (await sql`
    UPDATE editorial_posts
    SET
      title = ${input.title},
      slug = ${input.slug},
      description = ${input.description},
      category = ${input.category},
      body_markdown = ${input.bodyMarkdown},
      updated_at = NOW()
    WHERE id = ${postId}::uuid
    RETURNING *
  `) as EditorialPost[];

  const post = posts[0] ?? null;
  if (!post) return null;

  const revisionRows = (await sql`
    SELECT COALESCE(MAX(version), 0) + 1 AS next_version
    FROM post_revisions
    WHERE post_id = ${postId}::uuid
  `) as Array<{ next_version: number }>;

  await sql`
    INSERT INTO post_revisions (
      post_id,
      version,
      body_snapshot,
      title_snapshot,
      editor_id,
      change_note
    )
    VALUES (
      ${postId}::uuid,
      ${revisionRows[0].next_version},
      ${post.body_markdown},
      ${post.title},
      ${input.actorId ?? null}::uuid,
      'Editorial update'
    )
  `;

  return post;
}

export async function updateEditorialPostStatus(
  postId: string,
  status: EditorialPostStatus,
  actorId?: string
) {
  const publishedAt = status === "published" ? new Date().toISOString() : null;
  const posts = (await sql`
    UPDATE editorial_posts
    SET
      status = ${status},
      published_at = CASE
        WHEN ${publishedAt}::timestamptz IS NOT NULL THEN ${publishedAt}::timestamptz
        ELSE published_at
      END,
      updated_at = NOW()
    WHERE id = ${postId}::uuid
    RETURNING *
  `) as EditorialPost[];

  const post = posts[0] ?? null;
  if (post) {
    await sql`
      INSERT INTO audit_events (actor_id, event_type, entity_type, entity_id, payload)
      VALUES (
        ${actorId ?? null}::uuid,
        'editorial.status_changed',
        'editorial_post',
        ${postId}::uuid,
        ${JSON.stringify({ status })}::jsonb
      )
    `;
  }

  return post;
}

export async function scheduleEditorialPost(
  postId: string,
  scheduledFor: string,
  timezone = "Africa/Addis_Ababa",
  actorId?: string
) {
  const posts = (await sql`
    UPDATE editorial_posts
    SET status = 'scheduled', scheduled_for = ${scheduledFor}::timestamptz, updated_at = NOW()
    WHERE id = ${postId}::uuid
    RETURNING *
  `) as EditorialPost[];

  const post = posts[0] ?? null;
  if (!post) return null;

  await sql`
    INSERT INTO scheduled_publications (post_id, scheduled_for, timezone, created_by)
    VALUES (${postId}::uuid, ${scheduledFor}::timestamptz, ${timezone}, ${actorId ?? null}::uuid)
    ON CONFLICT (post_id) DO UPDATE SET
      scheduled_for = EXCLUDED.scheduled_for,
      timezone = EXCLUDED.timezone,
      status = 'pending',
      executed_at = NULL
  `;

  return post;
}

export type ResearchBrief = {
  id: string;
  title: string;
  question: string;
  status: "idea" | "researching" | "ready" | "used" | "archived";
  priority: number;
  target_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type PostRevision = {
  id: string;
  post_id: string;
  version: number;
  body_snapshot: string;
  title_snapshot: string | null;
  editor_id: string | null;
  change_note: string | null;
  created_at: string;
};

export async function getPostRevisions(postId: string) {
  return (await sql`
    SELECT id, post_id, version, body_snapshot, title_snapshot, editor_id, change_note, created_at
    FROM post_revisions
    WHERE post_id = ${postId}::uuid
    ORDER BY version DESC
  `) as PostRevision[];
}

export async function listResearchBriefs() {
  return (await sql`
    SELECT id, title, question, status, priority, target_date, notes, created_at, updated_at
    FROM research_briefs
    ORDER BY priority ASC, updated_at DESC
  `) as ResearchBrief[];
}

export async function createResearchBrief(input: {
  title: string;
  question: string;
  priority: number;
  targetDate?: string;
  notes?: string;
}) {
  const briefs = (await sql`
    INSERT INTO research_briefs (title, question, priority, target_date, notes)
    VALUES (
      ${input.title},
      ${input.question},
      ${input.priority},
      ${input.targetDate || null}::date,
      ${input.notes ?? ""}
    )
    RETURNING id, title, question, status, priority, target_date, notes, created_at, updated_at
  `) as ResearchBrief[];

  return briefs[0];
}