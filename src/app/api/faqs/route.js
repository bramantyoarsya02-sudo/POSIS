import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('FAQs fetch error:', error.message);
    return NextResponse.json({ data: [] });
  }

  return NextResponse.json({ data: data || [] });
}

