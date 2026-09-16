import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables from .env.local
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic query
    const result = await sql`SELECT version()`;
    console.log('✅ Database version:', result[0].version);
    
    // Test table existence
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('✅ Tables found:', tables.length);
    console.log('Tables:', tables.map((t: any) => t.table_name).join(', '));
    
    // Test categories data
    const categories = await sql`SELECT * FROM categories LIMIT 5`;
    console.log('✅ Sample categories:', categories.length);
    
    console.log('\n✅ Database connection test successful!');
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    process.exit(1);
  }
}

testConnection().then(() => process.exit(0));