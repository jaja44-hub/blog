import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(databaseUrl);
const statements = (await readFile(new URL("../db/editorial-foundation.sql", import.meta.url), "utf8"))
  .replace(/^\s*--.*$/gm, "")
  .split(/;\s*(?:\r?\n|$)/)
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.unsafe(statement);
}

const tables = await sql`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN (
      'admin_users',
      'roles',
      'admin_user_roles',
      'content_series',
      'editorial_posts',
      'post_revisions',
      'research_briefs',
      'research_sources',
      'scheduled_publications',
      'audit_events',
      'post_ratings'
    )
  ORDER BY table_name
`;

console.log(`Verified ${tables.length} editorial foundation tables.`);
console.log(tables.map(({ table_name: name }) => name).join("\n"));
