import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

const ALLOWED_CATEGORIES = ['toilet', 'perpustakaan', 'lapangan', 'wifi', 'kantin', 'lainnya'];

async function getUserMap() {
  const { data } = await supabase.from('users').select('id, name, class_or_division');
  const map = new Map();
  (data || []).forEach((u) => map.set(u.id, u));
  return map;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort');

    let query = supabase.from('aspirations').select('*').is('deleted_at', null);

    if (category && category !== 'semua') query = query.eq('category', category);
    if (status && status !== 'semua') query = query.eq('status', status);
    if (q) query = query.or(`title.ilike.%${q}%,body.ilike.%${q}%`);

    const orderCol = sort === 'populer' ? 'upvotes_count' : 'created_at';
    const { data, error } = await query.order(orderCol, { ascending: false });

    if (error) {
      console.error('Supabase GET /api/aspirations error:', error.message);
      return NextResponse.json({ data: [], meta: { total: 0, per_page: 10, current_page: 1 } });
    }

    const userMap = await getUserMap();
    const enriched = (data || []).map((asp) => {
      const author = userMap.get(asp.user_id);
      return {
        ...asp,
        author_name: asp.is_anonymous
          ? 'Siswa SMKN 1 Ciomas (Anonim)'
          : author
          ? `${author.name}${author.class_or_division ? ` (${author.class_or_division})` : ''}`
          : 'Warga SMKN 1 Ciomas',
      };
    });

    return NextResponse.json({
      data: enriched,
      meta: { total: enriched.length, per_page: 10, current_page: 1 },
    });
  } catch (err) {
    console.error('GET /api/aspirations catch:', err);
    return NextResponse.json({ data: [], meta: { total: 0, per_page: 10, current_page: 1 } });
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    const body = await request.json();

    let category = String(body.category || 'lainnya').toLowerCase();
    if (category === 'sarpras') category = 'toilet';
    if (!ALLOWED_CATEGORIES.includes(category)) category = 'lainnya';

    const userId = user?.id ? Number(user.id) : 1;
    const nowIso = new Date().toISOString();
    const ticketNumber = `POSIS-ASP-${Date.now().toString().slice(-6)}`;
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newAspiration = {
      ticket_number: ticketNumber,
      user_id: userId,
      category,
      title: String(body.title || 'Aspirasi Siswa SMKN 1 Ciomas').slice(0, 150),
      body: String(body.body || body.description || 'Penyampaian suara siswa'),
      is_anonymous: Boolean(body.is_anonymous),
      is_emergency: Boolean(body.is_emergency),
      status: 'menunggu_review',
      due_date: dueDate,
      upvotes_count: 0,
      comments_count: 0,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const { data, error } = await supabase
      .from('aspirations')
      .insert([newAspiration])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST /api/aspirations insert error:', error.message);
      return NextResponse.json(
        { message: `Gagal menyimpan aspirasi ke Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: {
          ...data,
          author_name: data.is_anonymous
            ? 'Siswa SMKN 1 Ciomas (Anonim)'
            : user?.name || 'Warga SMKN 1 Ciomas',
          comments: [],
        },
        message: 'Aspirasi berhasil dikirimkan ke Supabase.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/aspirations catch:', err);
    return NextResponse.json(
      { message: err.message || 'Gagal mengirim aspirasi.' },
      { status: 500 }
    );
  }
}

