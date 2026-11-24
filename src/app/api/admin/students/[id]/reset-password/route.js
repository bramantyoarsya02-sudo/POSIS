import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase/server';

export async function POST(request, { params }) {
  const { id } = await params;
  let newPass = 'siswa123';
  try {
    const body = await request.json();
    if (body?.password) newPass = body.password;
  } catch {}

  const defaultHash = bcrypt.hashSync(newPass, 10);
  const { error } = await supabase
    .from('users')
    .update({ password: defaultHash, updated_at: new Date().toISOString() })
    .eq('id', Number(id));

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: `Kata sandi akun siswa berhasil direset ke: ${newPass}`,
  });
}

