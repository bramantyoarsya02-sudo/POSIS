import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET() {
  try {
    const [
      { count: totalItems },
      { count: returnedItems },
      { count: activeLostItems },
      { count: activeFoundItems },
      { count: totalAspirations },
      { count: completedAspirations },
    ] = await Promise.all([
      supabase.from('items').select('*', { count: 'exact', head: true }),
      supabase.from('items').select('*', { count: 'exact', head: true }).eq('status', 'selesai'),
      supabase.from('items').select('*', { count: 'exact', head: true }).eq('type', 'hilang').eq('status', 'tersedia'),
      supabase.from('items').select('*', { count: 'exact', head: true }).eq('type', 'ditemukan').eq('status', 'tersedia'),
      supabase.from('aspirations').select('*', { count: 'exact', head: true }),
      supabase.from('aspirations').select('*', { count: 'exact', head: true }).eq('status', 'ditindaklanjuti'),
    ]);

    return NextResponse.json({
      data: {
        itemsReturned: returnedItems || 0,
        aspirationsSubmitted: totalAspirations || 0,
        aspirationsCompleted: completedAspirations || 0,
        activeLostItems: activeLostItems || 0,
        activeFoundItems: activeFoundItems || 0,
        totalItems: totalItems || 0,
      },
    });
  } catch (err) {
    console.error('Stats error:', err);
    return NextResponse.json({
      data: {
        itemsReturned: 0,
        aspirationsSubmitted: 0,
        aspirationsCompleted: 0,
        activeLostItems: 0,
        activeFoundItems: 0,
      },
    });
  }
}

