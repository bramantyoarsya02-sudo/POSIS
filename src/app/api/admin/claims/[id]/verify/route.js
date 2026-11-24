import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const user = getAuthUser(request);
  let verificationNote = '';
  try {
    const body = await request.json();
    verificationNote = body?.verification_note || '';
  } catch {}

  const nowIso = new Date().toISOString();
  const { data: claim, error } = await supabase
    .from('claims')
    .update({
      status: 'terverifikasi',
      verification_note: verificationNote,
      verified_by: user?.id ? Number(user.id) : 1,
      verified_at: nowIso,
      handover_at: nowIso,
      updated_at: nowIso,
    })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (claim?.item_id) {
    await supabase
      .from('items')
      .update({ status: 'selesai', updated_at: nowIso })
      .eq('id', claim.item_id);
  }

  return NextResponse.json({ data: claim, message: 'Klaim berhasil diverifikasi dan barang diserahkan.' });
}

