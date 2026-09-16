import { neon } from '@neondatabase/serverless';

// Database connection using @neondatabase/serverless
// Next.js automatically loads .env.local for server-side code
const sql = neon(process.env.DATABASE_URL!);

export { sql };

// Helper function for parameterized queries with dynamic SQL strings
// Use .query() for SQL in variables with numbered placeholders ($1, $2, etc.)
export async function query<T = any>(sqlQuery: string, params?: any[]): Promise<T[]> {
  try {
    const result = await sql.query(sqlQuery, params || []);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function for single row queries
export async function queryOne<T = any>(sqlQuery: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(sqlQuery, params);
  return results.length > 0 ? results[0] : null;
}

// Helper function for insert operations
export async function insert<T = any>(tableName: string, data: Record<string, any>): Promise<T> {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

  const sqlQuery = `
    INSERT INTO ${tableName} (${columns.join(', ')})
    VALUES (${placeholders})
    RETURNING *
  `;

  const result = await queryOne<T>(sqlQuery, values);
  if (!result) {
    throw new Error('Insert failed');
  }
  return result;
}

// Helper function for update operations
export async function update<T = any>(
  tableName: string,
  id: string,
  data: Record<string, any>
): Promise<T> {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');

  const sqlQuery = `
    UPDATE ${tableName}
    SET ${setClause}
    WHERE id = $1
    RETURNING *
  `;

  const result = await queryOne<T>(sqlQuery, [id, ...values]);
  if (!result) {
    throw new Error('Update failed');
  }
  return result;
}

// Helper function for delete operations (soft delete)
export async function softDelete(tableName: string, id: string): Promise<void> {
  const sqlQuery = `
    UPDATE ${tableName}
    SET status = 'deleted'
    WHERE id = $1
  `;

  await query(sqlQuery, [id]);
}

// User-specific queries
export const userQueries = {
  findByEmail: async (email: string) => {
    return queryOne(
      'SELECT * FROM users WHERE email = $1 AND status != $2',
      [email, 'deleted']
    );
  },

  findById: async (id: string) => {
    return queryOne(
      'SELECT * FROM users WHERE id = $1 AND status != $2',
      [id, 'deleted']
    );
  },

  create: async (data: {
    email: string;
    displayName?: string;
    passwordHash?: string;
    role?: string;
  }) => {
    return insert('users', {
      ...data,
      status: 'active',
      emailVerified: false,
    });
  },

  updateLastActive: async (userId: string) => {
    await query(
      'UPDATE users SET last_active_at = NOW() WHERE id = $1',
      [userId]
    );
  },
};

// Post-specific queries
export const postQueries = {
  findAll: async (filters?: {
    status?: string;
    categoryId?: string;
    authorId?: string;
    limit?: number;
    offset?: number;
  }) => {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(filters.status);
    }

    if (filters?.categoryId) {
      conditions.push(`category_id = $${paramIndex++}`);
      params.push(filters.categoryId);
    }

    if (filters?.authorId) {
      conditions.push(`author_id = $${paramIndex++}`);
      params.push(filters.authorId);
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const limitClause = filters?.limit
      ? `LIMIT $${paramIndex++}`
      : '';
    if (filters?.limit) params.push(filters.limit);

    const offsetClause = filters?.offset
      ? `OFFSET $${paramIndex++}`
      : '';
    if (filters?.offset) params.push(filters.offset);

    const sqlQuery = `
      SELECT p.*,
             ap.name as author_name,
             c.name as category_name,
             c.slug as category_slug
      FROM posts p
      LEFT JOIN author_profiles ap ON p.author_id = ap.id
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY published_at DESC NULLS LAST
      ${limitClause}
      ${offsetClause}
    `;

    return query(sqlQuery, params);
  },

  findBySlug: async (slug: string) => {
    return queryOne(
      `SELECT p.*,
              ap.name as author_name,
              ap.bio as author_bio,
              c.name as category_name,
              c.slug as category_slug
       FROM posts p
       LEFT JOIN author_profiles ap ON p.author_id = ap.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.status != $2`,
      [slug, 'deleted']
    );
  },

  create: async (data: {
    title: string;
    slug: string;
    dek?: string;
    body: string;
    authorId?: string;
    categoryId?: string;
    seriesId?: string;
    coverImageUrl?: string;
    coverImageAlt?: string;
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;
    readTime?: number;
    status?: string;
  }) => {
    return insert('posts', {
      ...data,
      status: data.status || 'draft',
      isIndexed: true,
      isFeatured: false,
    });
  },

  update: async (id: string, data: Record<string, any>) => {
    return update('posts', id, data);
  },
};

// Category-specific queries
export const categoryQueries = {
  findAll: async () => {
    return query(
      'SELECT * FROM categories WHERE status = $1 ORDER BY name',
      ['active']
    );
  },

  findBySlug: async (slug: string) => {
    return queryOne(
      'SELECT * FROM categories WHERE slug = $1 AND status = $2',
      [slug, 'active']
    );
  },
};

// Session-specific queries
export const sessionQueries = {
  create: async (data: {
    userId: string;
    deviceLabel?: string;
    ipAddress?: string;
    userAgent?: string;
  }) => {
    return insert('sessions', data);
  },

  findById: async (id: string) => {
    return queryOne(
      `SELECT s.*, u.email, u.display_name, u.role, u.status
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1 AND s.revoked_at IS NULL`,
      [id]
    );
  },

  revoke: async (id: string) => {
    await query(
      'UPDATE sessions SET revoked_at = NOW() WHERE id = $1',
      [id]
    );
  },
};

// Audit logging
export const auditQueries = {
  log: async (data: {
    actorId?: string;
    action: string;
    objectType?: string;
    objectId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
  }) => {
    return insert('audit_events', {
      ...data,
      metadata: data.metadata || {},
    });
  },
};