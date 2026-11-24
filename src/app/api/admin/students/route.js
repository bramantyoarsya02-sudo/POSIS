import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim();
    const status = searchParams.get('status');
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const perPage = Math.max(1, Number(searchParams.get('per_page') || 100));

    let query = supabase
      .from('users')
      .select('id, name, nisn, email, role, class_or_division, is_active')
      .order('id', { ascending: true });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,nisn.ilike.%${search}%`);
    }
    if (status === 'active') query = query.eq('is_active', true);
    if (status === 'inactive') query = query.eq('is_active', false);

    const { data: dbStudents, error } = await query;

    if (error) {
      return NextResponse.json({ data: [], meta: { total: 0, current_page: 1, last_page: 1, per_page: perPage } });
    }

    const formatted = (dbStudents || []).map((s) => ({
      id: s.id,
      name: s.name,
      nisn: s.nisn || '-',
      email: s.email,
      class: s.class_or_division || 'SMKN 1 Ciomas',
      class_or_division: s.class_or_division || 'SMKN 1 Ciomas',
      role: s.role,
      is_active: s.is_active !== false,
    }));

    const total = formatted.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const paged = formatted.slice(start, start + perPage);

    return NextResponse.json({
      data: paged,
      meta: { total, current_page: page, last_page: lastPage, per_page: perPage },
    });
  } catch (err) {
    return NextResponse.json({ data: [], meta: { total: 0, current_page: 1, last_page: 1 } });
  }
}

