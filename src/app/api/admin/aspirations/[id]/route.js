import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const { error } = await supabase.from('aspirations').delete().eq('id', Number(id));
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Aspirasi berhasil dihapus dari Supabase.' });
}

