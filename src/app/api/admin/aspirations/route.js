import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim();
    const status = searchParams.get('status');
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const perPage = Math.max(1, Number(searchParams.get('per_page') || 50));

    let query = supabase
      .from('aspirations')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (search) query = query.or(`title.ilike.%${search}%,ticket_number.ilike.%${search}%,body.ilike.%${search}%`);

    const [{ data: aspirations, error }, { data: users }] = await Promise.all([
      query,
      supabase.from('users').select('id, name, class_or_division'),
    ]);

    if (error) {
      return NextResponse.json({ data: [], meta: { total: 0, current_page: 1, last_page: 1 } });
    }

    const userMap = new Map();
    (users || []).forEach((u) => userMap.set(u.id, u));

    const enriched = (aspirations || []).map((asp) => {
      const author = userMap.get(asp.user_id);
      return {
        ...asp,
        author_name: asp.is_anonymous
          ? 'Siswa SMKN 1 Ciomas (Anonim)'
          : author
          ? author.name
          : 'Warga Sekolah',
      };
    });

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

