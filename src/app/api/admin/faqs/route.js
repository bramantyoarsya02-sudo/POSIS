import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return NextResponse.json({ data: [] });
  }
  return NextResponse.json({ data: data || [] });
}

export async function POST(request) {
  const body = await request.json();
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('faqs')
    .insert([
      {
        question: body.question,
        answer: body.answer,
        category: body.category || 'general',
        created_at: nowIso,
        updated_at: nowIso,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ data, message: 'FAQ berhasil ditambahkan ke Supabase.' }, { status: 201 });
}

