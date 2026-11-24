import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const user = getAuthUser(request);
    const body = await request.json();

    const userId = user?.id ? Number(user.id) : 1;
    const nowIso = new Date().toISOString();
    const claimNumber = `POSIS-CLM-${Date.now().toString().slice(-6)}`;

    const claimData = {
      claim_number: claimNumber,
      item_id: Number(id),
      user_id: userId,
      claimant_name: (body.claimant_name || user?.name || 'Siswa SMKN 1 Ciomas').slice(0, 150),
      proof_description: body.proof_description || body.description || 'Klaim kepemilikan barang',
      status: 'menunggu',
      created_at: nowIso,
      updated_at: nowIso,
    };

    const { data, error } = await supabase
      .from('claims')
      .insert([claimData])
      .select()
      .single();

    if (error) {
      console.error('Supabase claim insert error:', error.message);
      return NextResponse.json(
        { message: `Gagal mengajukan klaim ke Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    await supabase
      .from('items')
      .update({ status: 'diklaim', updated_at: nowIso })
      .eq('id', Number(id));

    return NextResponse.json(
      { data, message: 'Klaim barang berhasil diajukan ke Supabase.' },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message || 'Gagal mengajukan klaim barang.' },
      { status: 500 }
    );
  }
}

