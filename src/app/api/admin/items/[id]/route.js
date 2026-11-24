import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const itemId = Number(id);

  const { data: existing } = await supabase
    .from('items')
    .select('photo_path')
    .eq('id', itemId)
    .maybeSingle();

  if (existing?.photo_path && existing.photo_path.includes('/posis-items/')) {
    const fileName = existing.photo_path.split('/posis-items/')[1];
    if (fileName) {
      await supabase.storage.from('posis-items').remove([fileName]);
    }
  }

  const { error } = await supabase.from('items').delete().eq('id', itemId);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Data barang berhasil dihapus dari Supabase.' });
}


