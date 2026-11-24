import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const aspirationId = Number(id);
    const user = getAuthUser(request);
    const userId = user?.id ? Number(user.id) : 1;
    const nowIso = new Date().toISOString();

    const { data: existingVote } = await supabase
      .from('aspiration_votes')
      .select('id')
      .eq('aspiration_id', aspirationId)
      .eq('user_id', userId)
      .maybeSingle();

    const { data: currentAsp } = await supabase
      .from('aspirations')
      .select('upvotes_count')
      .eq('id', aspirationId)
      .single();

    if (!currentAsp) {
      return NextResponse.json({ message: 'Aspirasi tidak ditemukan.' }, { status: 404 });
    }

    let nextCount = currentAsp.upvotes_count || 0;
    let hasVoted = false;

    if (existingVote) {
      await supabase.from('aspiration_votes').delete().eq('id', existingVote.id);
      nextCount = Math.max(0, nextCount - 1);
      hasVoted = false;
    } else {
      await supabase.from('aspiration_votes').insert([
        {
          aspiration_id: aspirationId,
          user_id: userId,
          created_at: nowIso,
          updated_at: nowIso,
        },
      ]);
      nextCount = nextCount + 1;
      hasVoted = true;
    }

    await supabase
      .from('aspirations')
      .update({ upvotes_count: nextCount, updated_at: nowIso })
      .eq('id', aspirationId);

    return NextResponse.json({
      upvotes_count: nextCount,
      has_voted: hasVoted,
      message: 'Dukungan berhasil diperbarui di Supabase.',
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || 'Gagal memperbarui dukungan.' },
      { status: 500 }
    );
  }
}

