import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('aspirations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ message: 'Aspirasi tidak ditemukan.' }, { status: 404 });
    }

    const [{ data: users }, { data: rawComments }] = await Promise.all([
      supabase.from('users').select('id, name, class_or_division, role'),
      supabase
        .from('comments')
        .select('*')
        .eq('aspiration_id', Number(id))
        .order('created_at', { ascending: true }),
    ]);

    const userMap = new Map();
    (users || []).forEach((u) => userMap.set(u.id, u));

    const author = userMap.get(data.user_id);
    const comments = (rawComments || []).map((c) => {
      const cu = userMap.get(c.user_id);
      return {
        ...c,
        author_name: cu
          ? `${cu.name}${cu.class_or_division ? ` (${cu.class_or_division})` : ''}`
          : 'Warga Sekolah',
      };
    });

    return NextResponse.json({
      data: {
        ...data,
        author_name: data.is_anonymous
          ? 'Siswa SMKN 1 Ciomas (Anonim)'
          : author
          ? `${author.name}${author.class_or_division ? ` (${author.class_or_division})` : ''}`
          : 'Warga SMKN 1 Ciomas',
        comments,
      },
    });
  } catch (err) {
    return NextResponse.json({ message: 'Aspirasi tidak ditemukan.' }, { status: 404 });
  }
}

