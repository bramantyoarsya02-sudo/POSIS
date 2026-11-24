import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET() {
  try {
    const [{ data: users }, { data: items }, { data: aspirations }] = await Promise.all([
      supabase.from('users').select('id, name, class_or_division, role, created_at'),
      supabase.from('items').select('*').order('created_at', { ascending: false }),
      supabase.from('aspirations').select('*').order('created_at', { ascending: false }),
    ]);

    const userMap = new Map();
    (users || []).forEach((u) => userMap.set(u.id, u));

    const itemsList = items || [];
    const aspList = aspirations || [];
    const studentCount = (users || []).length;

    const recentActivities = [];
    itemsList.slice(0, 3).forEach((item) => {
      const reporter = userMap.get(item.user_id);
      recentActivities.push({
        id: `item-${item.id}`,
        type: 'lost_found',
        title: `Laporan ${item.type === 'hilang' ? 'Hilang' : 'Temuan'}: ${item.title}`,
        author: reporter ? `${reporter.name} (${reporter.class_or_division || ''})` : 'Warga Sekolah',
        badge: item.type === 'hilang' ? 'Hilang' : 'Ditemukan',
        badgeColor: item.type === 'hilang' ? 'amber' : 'emerald',
        created_at: new Date(item.created_at).toLocaleDateString('id-ID'),
      });
    });

    aspList.slice(0, 3).forEach((asp) => {
      const author = userMap.get(asp.user_id);
      recentActivities.push({
        id: `asp-${asp.id}`,
        type: 'aspiration',
        title: `Aspirasi: ${asp.title}`,
        author: asp.is_anonymous ? 'Anonim (Siswa SMKN 1 Ciomas)' : author?.name || 'Warga Sekolah',
        badge: 'Aspirasi',
        badgeColor: 'blue',
        created_at: new Date(asp.created_at).toLocaleDateString('id-ID'),
      });
    });

    return NextResponse.json({
      data: {
        stats: {
          totalStudents: studentCount,
          lostFound: {
            total: itemsList.length,
            hilang: itemsList.filter((i) => i.type === 'hilang').length,
            ditemukan: itemsList.filter((i) => i.type === 'ditemukan').length,
            selesai: itemsList.filter((i) => i.status === 'selesai' || i.status === 'diklaim').length,
          },
          aspirations: {
            total: aspList.length,
            baru: aspList.filter((a) => a.status === 'menunggu_review').length,
            diproses: aspList.filter((a) => a.status === 'diproses').length,
            selesai: aspList.filter((a) => a.status === 'ditindaklanjuti').length,
          },
          todayVisitors: Math.max(1, studentCount),
        },
        monthlyTrends: [
          { month: 'Sep', lostFound: Math.max(2, itemsList.length), aspirations: Math.max(3, aspList.length) },
          { month: 'Okt', lostFound: itemsList.length, aspirations: aspList.length },
          { month: 'Nov', lostFound: itemsList.length, aspirations: aspList.length },
        ],
        recentActivities,
      },
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    return NextResponse.json({ message: 'Gagal memuat dashboard.' }, { status: 500 });
  }
}

