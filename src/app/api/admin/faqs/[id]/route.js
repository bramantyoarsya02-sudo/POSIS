import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { data, error } = await supabase
    .from('faqs')
    .update({
      question: body.question,
      answer: body.answer,
      category: body.category || 'general',
      updated_at: new Date().toISOString(),
    })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data, message: 'FAQ berhasil diperbarui di Supabase.' });
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const { error } = await supabase.from('faqs').delete().eq('id', Number(id));
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'FAQ berhasil dihapus dari Supabase.' });
}

