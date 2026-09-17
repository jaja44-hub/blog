import { neon } from "@neondatabase/serverless";
import { query, queryOne } from "@/lib/db";

const sql = neon(process.env.DATABASE_URL!);

export type KnowledgeSource = {
  id: string;
  title: string | null;
  url: string | null;
  source_type: string | null;
  credibility_score: number | null;
  last_verified_at: string | null;
  link_health: string | null;
  publisher: string | null;
  jurisdiction: string | null;
  content_type: string | null;
  access_date: string | null;
  tags: any;
  usage_count: number | null;
  created_at: string;
  updated_at: string;
};

export type SourceUsage = {
  id: string;
  source_id: string | null;
  post_id: string | null;
  context: string | null;
  claim_verified: boolean | null;
  verification_notes: string | null;
  created_at: string;
};

export async function getKnowledgeSources() {
  try {
    return await query<KnowledgeSource>(
      `SELECT * FROM knowledge_sources 
       ORDER BY credibility_score DESC NULLS LAST, usage_count DESC NULLS LAST 
       LIMIT 50`
    );
  } catch (error) {
    console.error("Error fetching knowledge sources:", error);
    return [];
  }
}

export async function getKnowledgeSourceById(id: string) {
  try {
    return await queryOne<KnowledgeSource>(
      'SELECT * FROM knowledge_sources WHERE id = $1',
      [id]
    );
  } catch (error) {
    console.error("Error fetching knowledge source by ID:", error);
    return null;
  }
}

export async function createKnowledgeSource(input: {
  title: string;
  url: string;
  source_type?: string;
  publisher?: string;
  jurisdiction?: string;
  content_type?: string;
  tags?: any;
}) {
  try {
    const credibilityScore = calculateCredibilityScore(input);
    console.log("Creating knowledge source with credibility score:", credibilityScore);
    console.log("Input data:", JSON.stringify(input, null, 2));
    
    // Use direct sql neon call for insert
    const result = (await sql`
      INSERT INTO knowledge_sources (title, url, credibility_score, usage_count)
      VALUES (${input.title}, ${input.url}, ${credibilityScore}, 0)
      RETURNING *
    `) as KnowledgeSource[];

    if (!result || result.length === 0) {
      throw new Error('Failed to create knowledge source');
    }

    // If successful, update with additional fields
    if (input.source_type || input.publisher || input.jurisdiction || input.content_type || input.tags) {
      await query(
        `UPDATE knowledge_sources 
         SET source_type = COALESCE($2, source_type),
             publisher = COALESCE($3, publisher),
             jurisdiction = COALESCE($4, jurisdiction),
             content_type = COALESCE($5, content_type),
             tags = COALESCE($6, tags),
             updated_at = NOW()
         WHERE id = $1`,
        [result[0].id, input.source_type, input.publisher, input.jurisdiction, input.content_type, input.tags]
      );
    }

    return result[0];
  } catch (error) {
    console.error("Error creating knowledge source:", error);
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export async function deleteKnowledgeSource(id: string) {
  try {
    await query(
      'DELETE FROM knowledge_sources WHERE id = $1',
      [id]
    );
    return true;
  } catch (error) {
    console.error("Error deleting knowledge source:", error);
    throw error;
  }
}

export async function incrementSourceUsage(sourceId: string) {
  try {
    return await queryOne<KnowledgeSource>(
      `UPDATE knowledge_sources
       SET usage_count = COALESCE(usage_count, 0) + 1, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [sourceId]
    );
  } catch (error) {
    console.error("Error incrementing source usage:", error);
    throw error;
  }
}

export async function getSourceUsageByPost(postId: string) {
  try {
    return await query<any>(
      `SELECT su.*, ks.title, ks.url, ks.publisher
       FROM source_usage su
       JOIN knowledge_sources ks ON su.source_id = ks.id
       WHERE su.post_id = $1
       ORDER BY su.created_at DESC`,
      [postId]
    );
  } catch (error) {
    console.error("Error fetching source usage by post:", error);
    return [];
  }
}

export async function createSourceUsage(input: {
  source_id: string;
  post_id: string;
  context?: string;
  claim_verified?: boolean;
  verification_notes?: string;
}) {
  try {
    const usage = await queryOne<SourceUsage>(
      `INSERT INTO source_usage (source_id, post_id, context, claim_verified, verification_notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        input.source_id,
        input.post_id,
        input.context ?? null,
        input.claim_verified ?? null,
        input.verification_notes ?? null
      ]
    );

    await incrementSourceUsage(input.source_id);
    return usage;
  } catch (error) {
    console.error("Error creating source usage:", error);
    throw error;
  }
}

function calculateCredibilityScore(input: {
  title: string;
  url: string;
  source_type?: string;
  publisher?: string;
  jurisdiction?: string;
}): number {
  let score = 5.0;

  if (input.publisher) {
    const knownPublishers = ['academic', 'government', 'court', 'official', 'legislation'];
    if (knownPublishers.some(pub => input.publisher!.toLowerCase().includes(pub))) {
      score += 2.0;
    }
  }

  if (input.source_type) {
    const highCredibilityTypes = ['academic', 'legal', 'official', 'primary'];
    if (highCredibilityTypes.some(type => input.source_type!.toLowerCase().includes(type))) {
      score += 1.5;
    }
  }

  if (input.url) {
    const trustedDomains = ['.gov', '.edu', '.org', 'court', 'parliament', 'legislation'];
    if (trustedDomains.some(domain => input.url!.toLowerCase().includes(domain))) {
      score += 1.0;
    }
  }

  if (input.jurisdiction) {
    score += 0.5;
  }

  return Math.min(Math.max(score, 0), 10);
}
