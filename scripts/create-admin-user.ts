import { config } from 'dotenv';
import { hash } from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

// Load environment variables from .env.local
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function createAdminUser() {
  const email = 'admin@addiscrown.et';
  const password = 'AddisCrown2024!'; // Change this in production
  const displayName = 'Admin User';
  const role = 'owner';

  try {
    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existing.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create user
    const result = await sql`
      INSERT INTO users (email, display_name, password_hash, role, status, email_verified)
      VALUES (${email}, ${displayName}, ${passwordHash}, ${role}, 'active', true)
      RETURNING id, email, display_name, role
    `;

    console.log('Admin user created successfully:');
    console.log(result[0]);
    console.log('\nEmail:', email);
    console.log('Password:', password);
    console.log('\nIMPORTANT: Change this password in production!');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser().then(() => process.exit(0));