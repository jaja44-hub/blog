import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export type MediaAsset = {
  id: string;
  storage_key: string;
  original_filename: string | null;
  mime_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  credit: string | null;
  license: string | null;
  upload_user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type MediaUsage = {
  id: string;
  media_id: string | null;
  post_id: string | null;
  usage_context: string | null;
  placement: string | null;
  performance_score: number | null;
  created_at: string;
};

export type MediaTag = {
  id: string;
  media_id: string | null;
  tag: string | null;
  relevance_score: number | null;
  created_at: string;
};

export async function getMediaAssets() {
  try {
    return (await sql`
      SELECT * FROM media_assets 
      ORDER BY created_at DESC 
      LIMIT 50
    `) as MediaAsset[];
  } catch (error) {
    console.error("Error fetching media assets:", error);
    return [];
  }
}

export async function getMediaAssetById(id: string) {
  try {
    const assets = (await sql`
      SELECT * FROM media_assets WHERE id = ${id}::uuid
    `) as MediaAsset[];
    return assets[0] ?? null;
  } catch (error) {
    console.error("Error fetching media asset by ID:", error);
    return null;
  }
}

export async function createMediaAsset(input: {
  storage_key: string;
  original_filename?: string;
  mime_type?: string;
  file_size?: number;
  width?: number;
  height?: number;
  alt_text?: string;
  caption?: string;
  credit?: string;
  license?: string;
  upload_user_id?: string;
}) {
  try {
    const assets = (await sql`
      INSERT INTO media_assets (
        storage_key,
        original_filename,
        mime_type,
        file_size,
        width,
        height,
        alt_text,
        caption,
        credit,
        license,
        upload_user_id
      )
      VALUES (
        ${input.storage_key},
        ${input.original_filename ?? null},
        ${input.mime_type ?? null},
        ${input.file_size ?? null},
        ${input.width ?? null},
        ${input.height ?? null},
        ${input.alt_text ?? null},
        ${input.caption ?? null},
        ${input.credit ?? null},
        ${input.license ?? null},
        ${input.upload_user_id ?? null}
      )
      RETURNING *
    `) as MediaAsset[];

    return assets[0];
  } catch (error) {
    console.error("Error creating media asset:", error);
    throw error;
  }
}

export async function updateMediaAsset(id: string, input: {
  alt_text?: string;
  caption?: string;
  credit?: string;
  license?: string;
}) {
  try {
    const assets = (await sql`
      UPDATE media_assets
      SET 
        alt_text = COALESCE(${input.alt_text ?? null}, alt_text),
        caption = COALESCE(${input.caption ?? null}, caption),
        credit = COALESCE(${input.credit ?? null}, credit),
        license = COALESCE(${input.license ?? null}, license),
        updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *
    `) as MediaAsset[];
    return assets[0] ?? null;
  } catch (error) {
    console.error("Error updating media asset:", error);
    throw error;
  }
}

export async function deleteMediaAsset(id: string) {
  try {
    await sql`
      DELETE FROM media_assets WHERE id = ${id}::uuid
    `;
    return true;
  } catch (error) {
    console.error("Error deleting media asset:", error);
    throw error;
  }
}

export async function getMediaUsageByPost(postId: string) {
  try {
    const usage = (await sql`
      SELECT mu.*, ma.original_filename, ma.mime_type, ma.file_size
      FROM media_usage mu
      JOIN media_assets ma ON mu.media_id = ma.id
      WHERE mu.post_id = ${postId}::uuid
      ORDER BY mu.created_at DESC
    `) as any[];
    return usage;
  } catch (error) {
    console.error("Error fetching media usage by post:", error);
    return [];
  }
}

export async function createMediaUsage(input: {
  media_id: string;
  post_id: string;
  usage_context?: string;
  placement?: string;
  performance_score?: number;
}) {
  try {
    const usage = (await sql`
      INSERT INTO media_usage (
        media_id,
        post_id,
        usage_context,
        placement,
        performance_score
      )
      VALUES (
        ${input.media_id},
        ${input.post_id},
        ${input.usage_context ?? null},
        ${input.placement ?? null},
        ${input.performance_score ?? null}
      )
      RETURNING *
    `) as MediaUsage[];
    return usage[0];
  } catch (error) {
    console.error("Error creating media usage:", error);
    throw error;
  }
}

export async function getMediaTags(mediaId: string) {
  try {
    return (await sql`
      SELECT * FROM media_tags WHERE media_id = ${mediaId}::uuid
    `) as MediaTag[];
  } catch (error) {
    console.error("Error fetching media tags:", error);
    return [];
  }
}

export async function createMediaTag(input: {
  media_id: string;
  tag: string;
  relevance_score?: number;
}) {
  try {
    const tags = (await sql`
      INSERT INTO media_tags (media_id, tag, relevance_score)
      VALUES (${input.media_id}, ${input.tag}, ${input.relevance_score ?? null})
      RETURNING *
    `) as MediaTag[];
    return tags[0];
  } catch (error) {
    console.error("Error creating media tag:", error);
    throw error;
  }
}

export async function deleteMediaTag(id: string) {
  try {
    await sql`
      DELETE FROM media_tags WHERE id = ${id}::uuid
    `;
    return true;
  } catch (error) {
    console.error("Error deleting media tag:", error);
    throw error;
  }
}

export async function getMediaUsageSummary() {
  try {
    const summary = (await sql`
      SELECT 
        COUNT(*) as total_usage,
        COUNT(DISTINCT post_id) as posts_with_media,
        AVG(performance_score) as avg_performance
      FROM media_usage
    `) as any[];
    return summary[0] || { total_usage: 0, posts_with_media: 0, avg_performance: null };
  } catch (error) {
    console.error("Error fetching media usage summary:", error);
    return { total_usage: 0, posts_with_media: 0, avg_performance: null };
  }
}

export function suggestSmartTags(asset: MediaAsset): string[] {
  const tags: string[] = [];
  const textToAnalyze = [
    asset.original_filename || '',
    asset.alt_text || '',
    asset.caption || '',
    asset.credit || ''
  ].join(' ').toLowerCase();

  // File type detection
  if (asset.mime_type) {
    if (asset.mime_type.startsWith('image/')) {
      tags.push('image');
      if (asset.mime_type.includes('jpeg') || asset.mime_type.includes('jpg')) tags.push('jpeg');
      if (asset.mime_type.includes('png')) tags.push('png');
      if (asset.mime_type.includes('gif')) tags.push('gif');
      if (asset.mime_type.includes('svg')) tags.push('svg');
      if (asset.mime_type.includes('webp')) tags.push('webp');
    } else if (asset.mime_type.startsWith('video/')) {
      tags.push('video');
      if (asset.mime_type.includes('mp4')) tags.push('mp4');
      if (asset.mime_type.includes('webm')) tags.push('webm');
    } else if (asset.mime_type.startsWith('audio/')) {
      tags.push('audio');
      if (asset.mime_type.includes('mp3')) tags.push('mp3');
    } else if (asset.mime_type.includes('pdf')) {
      tags.push('document', 'pdf');
    }
  }

  // Dimension-based tags
  if (asset.width && asset.height) {
    const aspectRatio = asset.width / asset.height;
    if (aspectRatio > 1.2) tags.push('landscape');
    else if (aspectRatio < 0.8) tags.push('portrait');
    else tags.push('square');
    
    if (asset.width >= 1920) tags.push('hd', 'wide');
    else if (asset.width >= 1200) tags.push('high-res');
  }

  // Keyword-based tagging from filename and metadata
  const keywords = [
    'ethiopia', 'addis', 'africa', 'east', 'law', 'legal', 'court', 'government',
    'policy', 'rights', 'contract', 'market', 'technology', 'ai', 'policy',
    'business', 'economy', 'finance', 'infrastructure', 'education', 'health',
    'culture', 'history', 'politics', 'democracy', 'constitution', 'parliament',
    'protest', 'election', 'development', 'urban', 'rural', 'trade', 'investment',
    'agriculture', 'industry', 'energy', 'water', 'transport', 'telecom',
    'internet', 'digital', 'innovation', 'startup', 'entrepreneur', 'banking',
    'currency', 'inflation', 'employment', 'labor', 'gender', 'women', 'youth',
    'environment', 'climate', 'sustainability', 'renewable', 'solar', 'wind',
    'geothermal', 'hydropower', 'tourism', 'heritage', 'museum', 'monument',
    'religion', 'church', 'mosque', 'festival', 'celebration', 'food', 'coffee',
    'teff', 'injera', 'music', 'art', 'literature', 'film', 'media', 'news',
    'journalism', 'press', 'broadcast', 'television', 'radio', 'social', 'media',
    'facebook', 'twitter', 'telegram', 'whatsapp', 'instagram', 'tiktok',
    'photo', 'photography', 'illustration', 'graphic', 'design', 'logo', 'brand',
    'marketing', 'advertising', 'promotion', 'campaign', 'event', 'conference',
    'workshop', 'training', 'education', 'school', 'university', 'research',
    'study', 'report', 'analysis', 'data', 'statistics', 'chart', 'graph',
    'map', 'infographic', 'diagram', 'icon', 'symbol', 'flag', 'portrait',
    'headshot', 'team', 'group', 'crowd', 'building', 'architecture', 'street',
    'city', 'landscape', 'nature', 'wildlife', 'animal', 'plant', 'flower',
    'sky', 'weather', 'season', 'night', 'day', 'sunset', 'sunrise'
  ];

  keywords.forEach(keyword => {
    if (textToAnalyze.includes(keyword) && !tags.includes(keyword)) {
      tags.push(keyword);
    }
  });

  // License-based tagging
  if (asset.license) {
    const licenseLower = asset.license.toLowerCase();
    if (licenseLower.includes('cc') || licenseLower.includes('creative')) {
      tags.push('creative-commons');
      if (licenseLower.includes('by')) tags.push('attribution');
      if (licenseLower.includes('sa')) tags.push('share-alike');
      if (licenseLower.includes('nc')) tags.push('non-commercial');
      if (licenseLower.includes('nd')) tags.push('no-derivatives');
    }
    if (licenseLower.includes('public')) tags.push('public-domain');
    if (licenseLower.includes('mit')) tags.push('mit-license');
    if (licenseLower.includes('apache')) tags.push('apache-license');
  }

  // Remove duplicates and return
  return [...new Set(tags)];
}