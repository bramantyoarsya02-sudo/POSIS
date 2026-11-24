import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const status = searchParams.get('status');
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const perPage = Math.max(1, Number(searchParams.get('per_page') || 50));

    let query = supabase.from('claims').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const [{ data: claims, error }, { data: items }, { data: users }] = await Promise.all([
      query,
      supabase.from('items').select('id, title, ticket_number, location, handover_point'),
      supabase.from('users').select('id, name, nisn, class_or_division'),
    ]);

    if (error) {
      return NextResponse.json({ data: [], meta: { total: 0, current_page: 1, last_page: 1 } });
    }

    const itemMap = new Map();
    (items || []).forEach((i) => itemMap.set(i.id, i));
    const userMap = new Map();
    (users || []).forEach((u) => userMap.set(u.id, u));

    let enriched = (claims || []).map((cl) => {
      const item = itemMap.get(cl.item_id) || {};
      const claimant = userMap.get(cl.user_id) || {};
      return {
        ...cl,
        claimant_name: cl.claimant_name || claimant.name || 'Siswa SMKN 1 Ciomas',
        claimant_nisn: claimant.nisn || '-',
        claimant_class: claimant.class_or_division || '-',
        item_title: item.title || 'Barang Lost & Found',
        item_ticket: item.ticket_number || '-',
        item_location: item.location || '-',
        item_handover_point: item.handover_point || 'ruang_piket',
      };
    });

    if (search) {
      enriched = enriched.filter(
        (c) =>
          c.claimant_name.toLowerCase().includes(search) ||
          c.claim_number.toLowerCase().includes(search) ||
          c.item_title.toLowerCase().includes(search)
      );
    }

    const total = enriched.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;

    return NextResponse.json({
      data: enriched.slice(start, start + perPage),
      meta: { total, current_page: page, last_page: lastPage, per_page: perPage },
    });
  } catch (err) {
    return NextResponse.json({ data: [], meta: { total: 0, current_page: 1, last_page: 1 } });
  }
}

