import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection with a simple query
    const result = await sql`SELECT NOW() as current_time`;

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: result,
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
