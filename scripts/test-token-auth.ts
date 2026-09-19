import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testTokenAuth() {
  const token = process.env.ADMIN_ACCESS_TOKEN;
  if (!token) throw new Error('ADMIN_ACCESS_TOKEN is not configured');
  
  try {
    console.log('Testing token-based authentication...');
    console.log('Target: http://localhost:3000/api/admin/session');
    
    const response = await fetch('http://localhost:3000/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
    if (response.ok && result.authenticated) {
      console.log('✅ Token-based authentication is working');
      console.log('Evidence: Successful authentication with existing token');
    } else {
      console.log('❌ Token-based authentication failed');
      console.log('Error:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Only run if dev server is running
testTokenAuth().then(() => process.exit(0));
