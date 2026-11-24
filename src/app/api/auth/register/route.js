import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase/server';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, nisn, class: studentClass, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nama, Email, dan Kata sandi wajib diisi.' },
        { status: 422 }
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email: email.toLowerCase(),
          nisn: nisn || null,
          class_or_division: studentClass || 'Siswa Aktif SMKN 1 Ciomas',
          password: hashedPassword,
          role: 'siswa',
          avatar_url: avatarUrl,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: error?.message || 'Gagal mendaftarkan pengguna.' },
        { status: 400 }
      );
    }

    const userPayload = {
      id: data.id,
      name: data.name,
      email: data.email,
      nisn: data.nisn,
      role: 'siswa',
      class: data.class_or_division,
      class_or_division: data.class_or_division,
      avatar_url: data.avatar_url,
    };
    const token = signToken(userPayload);
    return NextResponse.json(
      { token, user: userPayload, message: 'Pendaftaran berhasil.' },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message || 'Gagal memproses pendaftaran.' },
      { status: 500 }
    );
  }
}

