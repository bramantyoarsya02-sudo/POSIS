import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function PATCH(_request, { params }) {
  const { id } = await params;
  const studentId = Number(id);

  const { data: current } = await supabase
    .from('users')
    .select('is_active')
    .eq('id', studentId)
    .single();

  if (!current) {
    return NextResponse.json({ message: 'Siswa tidak ditemukan.' }, { status: 404 });
  }

  const nextActive = !current.is_active;
  const { error } = await supabase
    .from('users')
    .update({ is_active: nextActive, updated_at: new Date().toISOString() })
    .eq('id', studentId);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    is_active: nextActive,
    message: 'Status keaktifan siswa berhasil diperbarui.',
  });
}

