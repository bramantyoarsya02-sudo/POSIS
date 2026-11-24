import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { data, error } = await supabase
    .from('items')
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, message: 'Status barang berhasil diperbarui di Supabase.' });
}

