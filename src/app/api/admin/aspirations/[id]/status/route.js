import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  const updateFields = {
    updated_at: new Date().toISOString(),
  };
  if (body.status) updateFields.status = body.status;
  if (body.admin_reply !== undefined) updateFields.admin_reply = body.admin_reply;
  if (body.official_response !== undefined) updateFields.admin_reply = body.official_response;

  const { data, error } = await supabase
    .from('aspirations')
    .update(updateFields)
    .eq('id', Number(id))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    message: 'Status dan balasan resmi aspirasi berhasil diperbarui di Supabase.',
  });
}

