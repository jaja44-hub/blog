import { neon } from '@neondatabase/serverless';

// Database connection using @neondatabase/serverless
// Next.js automatically loads .env.local for server-side code
const sql = neon(process.env.DATABASE_URL!);

export { sql };

// Database functions currently disabled to prevent build errors
// Will be re-enabled during Sprint 2 database integration
// Template string typing issue with @neondatabase/serverless
export async function query<T = any>(sqlQuery: TemplateStringsArray, ...params: any[]): Promise<T[]> {
  try {
    const result = await sql(sqlQuery, ...params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function queryOne<T = any>(sqlQuery: TemplateStringsArray, ...params: any[]): Promise<T | null> {
  const results = await query<T>(sqlQuery, ...params);
  return results.length > 0 ? results[0] : null;
}

export async function insert<T = any>(tableName: string, data: Record<string, any>): Promise<T> {
  // Currently disabled - will be re-enabled in Sprint 2
  throw new Error('Database functions temporarily disabled');
}

export async function update<T = any>(
  tableName: string,
  id: string,
  data: Record<string, any>
): Promise<T> {
  // Currently disabled - will be re-enabled in Sprint 2
  throw new Error('Database functions temporarily disabled');
}

export async function softDelete(tableName: string, id: string): Promise<void> {
  // Currently disabled - will be re-enabled in Sprint 2
  throw new Error('Database functions temporarily disabled');
}

// User-specific queries - disabled for Sprint 1
export const userQueries = {
  findByEmail: async (email: string) => {
    throw new Error('Database functions temporarily disabled');
  },
  findById: async (id: string) => {
    throw new Error('Database functions temporarily disabled');
  },
  create: async (data: any) => {
    throw new Error('Database functions temporarily disabled');
  },
  updateLastActive: async (userId: string) => {
    throw new Error('Database functions temporarily disabled');
  },
};

// Post-specific queries - disabled for Sprint 1
export const postQueries = {
  findAll: async (filters?: any) => {
    throw new Error('Database functions temporarily disabled');
  },
  findBySlug: async (slug: string) => {
    throw new Error('Database functions temporarily disabled');
  },
  create: async (data: any) => {
    throw new Error('Database functions temporarily disabled');
  },
  update: async (id: string, data: any) => {
    throw new Error('Database functions temporarily disabled');
  },
};

// Category-specific queries - disabled for Sprint 1
export const categoryQueries = {
  findAll: async () => {
    throw new Error('Database functions temporarily disabled');
  },
  findBySlug: async (slug: string) => {
    throw new Error('Database functions temporarily disabled');
  },
};

// Session-specific queries - disabled for Sprint 1
export const sessionQueries = {
  create: async (data: any) => {
    throw new Error('Database functions temporarily disabled');
  },
  findById: async (id: string) => {
    throw new Error('Database functions temporarily disabled');
  },
  revoke: async (id: string) => {
    throw new Error('Database functions temporarily disabled');
  },
};

// Audit logging - disabled for Sprint 1
export const auditQueries = {
  log: async (data: any) => {
    throw new Error('Database functions temporarily disabled');
  },
};