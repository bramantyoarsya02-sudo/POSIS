import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET() {
  const notifications = [];

  try {
    const [{ data: recentItems }, { data: recentAsp }] = await Promise.all([
      supabase.from('items').select('id, title, type, status, created_at').order('created_at', { ascending: false }).limit(3),
      supabase.from('aspirations').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(3),
    ]);

    (recentItems || []).forEach((item) => {
      notifications.push({
        id: `item-${item.id}`,
        title: item.type === 'ditemukan' ? 'Barang Temuan Baru' : 'Laporan Barang Hilang',
        message: item.title,
        badge_type: item.type === 'ditemukan' ? 'success' : 'warning',
        link: `/lost-found/${item.id}`,
        created_at: new Date(item.created_at).toLocaleDateString('id-ID'),
      });
    });

    (recentAsp || []).forEach((asp) => {
      notifications.push({
        id: `asp-${asp.id}`,
        title: asp.status === 'ditindaklanjuti' ? 'Aspirasi Ditindaklanjuti' : 'Aspirasi Siswa Terbaru',
        message: asp.title,
        badge_type: asp.status === 'ditindaklanjuti' ? 'success' : 'info',
        link: `/aspirasi/${asp.id}`,
        created_at: new Date(asp.created_at).toLocaleDateString('id-ID'),
      });
    });
  } catch (e) {
    // ignore
  }

  return NextResponse.json({
    notifications,
    unread_count: notifications.length,
  });
}

