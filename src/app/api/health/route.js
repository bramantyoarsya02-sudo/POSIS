import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET() {
  let dbConnected = false;
  let userCount = 0;

  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    if (!error) {
      dbConnected = true;
      userCount = count || 0;
    }
  } catch {
    dbConnected = false;
  }

  return NextResponse.json({
    status: 'ok',
    service: 'POSIS Next.js API',
    database: dbConnected ? 'Supabase PostgreSQL Connected' : 'Supabase Connection Pending',
    users: userCount,
    timestamp: new Date().toISOString(),
  });
}

