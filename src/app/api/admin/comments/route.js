import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const perPage = Math.max(1, Number(searchParams.get('per_page') || 50));

    const [{ data: comments, error }, { data: aspirations }, { data: users }] = await Promise.all([
      supabase.from('comments').select('*').order('created_at', { ascending: false }),
      supabase.from('aspirations').select('id, title, ticket_number'),
      supabase.from('users').select('id, name, class_or_division'),
    ]);

    if (error) {
      return NextResponse.json({ data: [], meta: { total: 0, current_page: 1, last_page: 1 } });
    }

    const aspMap = new Map();
    (aspirations || []).forEach((a) => aspMap.set(a.id, a));
    const userMap = new Map();
    (users || []).forEach((u) => userMap.set(u.id, u));

    let enriched = (comments || []).map((cm) => {
      const asp = aspMap.get(cm.aspiration_id) || {};
      const author = userMap.get(cm.user_id) || {};
      return {
        ...cm,
        author_name: author.name || 'Warga Sekolah',
        author_class: author.class_or_division || '-',
        aspiration_title: asp.title || 'Aspirasi',
        aspiration_ticket: asp.ticket_number || '-',
      };
    });

    if (search) {
      enriched = enriched.filter(
        (c) =>
          c.body.toLowerCase().includes(search) ||
          c.author_name.toLowerCase().includes(search) ||
          c.aspiration_title.toLowerCase().includes(search)
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

