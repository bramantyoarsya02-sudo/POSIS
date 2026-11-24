import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ message: 'Barang tidak ditemukan.' }, { status: 404 });
    }

    let reportedBy = 'Warga SMKN 1 Ciomas';
    if (data.user_id) {
      const { data: u } = await supabase
        .from('users')
        .select('name, class_or_division')
        .eq('id', data.user_id)
        .single();
      if (u) {
        reportedBy = `${u.name}${u.class_or_division ? ` (${u.class_or_division})` : ''}`;
      }
    }

    return NextResponse.json({
      data: {
        ...data,
        reported_by: reportedBy,
        photo_url: data.photo_path || null,
      },
    });
  } catch (err) {
    return NextResponse.json({ message: 'Barang tidak ditemukan.' }, { status: 404 });
  }
}

