import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const aspirationId = Number(id);
    const user = getAuthUser(request);
    const body = await request.json();

    const userId = user?.id ? Number(user.id) : 1;
    const bodyText = (body.body || body.comment || '').trim();
    if (!bodyText) {
      return NextResponse.json({ message: 'Isi tanggapan wajib diisi.' }, { status: 422 });
    }

    const isOfficial = Boolean(user && user.role !== 'siswa');
    const nowIso = new Date().toISOString();

    const { data: commentData, error } = await supabase
      .from('comments')
      .insert([
        {
          aspiration_id: aspirationId,
          user_id: userId,
          body: bodyText,
          is_official_reply: isOfficial,
          created_at: nowIso,
          updated_at: nowIso,
        },
      ])
      .select()
      .single();

    if (error || !commentData) {
      return NextResponse.json(
        { message: error?.message || 'Gagal menyimpan komentar.' },
        { status: 500 }
      );
    }

    const { data: currentAsp } = await supabase
      .from('aspirations')
      .select('comments_count')
      .eq('id', aspirationId)
      .single();

    if (currentAsp) {
      await supabase
        .from('aspirations')
        .update({
          comments_count: (currentAsp.comments_count || 0) + 1,
          updated_at: nowIso,
        })
        .eq('id', aspirationId);
    }

    return NextResponse.json(
      {
        data: {
          ...commentData,
          author_name: user?.name || 'Warga Sekolah',
        },
        message: 'Tanggapan berhasil disimpan ke Supabase.',
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message || 'Gagal mengirim tanggapan.' },
      { status: 500 }
    );
  }
}

