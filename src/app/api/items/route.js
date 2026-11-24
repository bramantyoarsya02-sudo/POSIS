import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

const ALLOWED_CATEGORIES = ['alat_tulis', 'elektronik', 'pakaian', 'berkas', 'lainnya'];
const ALLOWED_HANDOVER_POINTS = ['ruang_piket', 'ruang_bk', 'pos_satpam'];
const STORAGE_BUCKET = 'posis-items';

async function getUserMap() {
  const { data } = await supabase.from('users').select('id, name, class_or_division');
  const map = new Map();
  (data || []).forEach((u) => map.set(u.id, u));
  return map;
}

async function uploadItemPhoto(photoFile, ticketNumber) {
  if (!photoFile || typeof photoFile !== 'object' || typeof photoFile.arrayBuffer !== 'function' || photoFile.size <= 0) {
    return null;
  }

  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = (buckets || []).some((b) => b.name === STORAGE_BUCKET);
    if (!exists) {
      await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024,
      });
    }

    const mime = photoFile.type || 'image/jpeg';
    const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
    const filePath = `${ticketNumber}-${Date.now()}.${ext}`;
    const fileBuffer = Buffer.from(await photoFile.arrayBuffer());

    const { error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: mime,
        upsert: true,
      });

    if (uploadErr) {
      console.error('Supabase Storage upload error:', uploadErr.message);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicData?.publicUrl || null;
  } catch (err) {
    console.error('Photo upload helper error:', err.message);
    return null;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    let query = supabase.from('items').select('*').is('deleted_at', null);

    if (type && type !== 'semua') query = query.eq('type', type);
    if (category && category !== 'semua') query = query.eq('category', category);
    if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%`);
    if (startDate) query = query.gte('event_date', startDate);
    if (endDate) query = query.lte('event_date', endDate);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase GET /api/items error:', error.message);
      return NextResponse.json({ data: [], meta: { total: 0, per_page: 12, current_page: 1 } });
    }

    const userMap = await getUserMap();
    const enriched = (data || []).map((item) => {
      const reporter = userMap.get(item.user_id);
      return {
        ...item,
        reported_by: reporter
          ? `${reporter.name}${reporter.class_or_division ? ` (${reporter.class_or_division})` : ''}`
          : 'Warga SMKN 1 Ciomas',
        photo_url: item.photo_path || null,
      };
    });

    return NextResponse.json({
      data: enriched,
      meta: { total: enriched.length, per_page: 12, current_page: 1 },
    });
  } catch (err) {
    console.error('GET /api/items catch:', err);
    return NextResponse.json({ data: [], meta: { total: 0, per_page: 12, current_page: 1 } });
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    const contentType = request.headers.get('content-type') || '';

    let payload = {};
    let photoFile = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      payload = {
        type: formData.get('type'),
        title: formData.get('title'),
        category: formData.get('category'),
        location: formData.get('location'),
        event_date: formData.get('event_date'),
        description: formData.get('description'),
        handover_point: formData.get('handover_point'),
      };
      photoFile = formData.get('photo');
    } else {
      payload = await request.json();
    }

    const type = payload.type === 'hilang' ? 'hilang' : 'ditemukan';
    let category = String(payload.category || 'lainnya').toLowerCase();
    if (!ALLOWED_CATEGORIES.includes(category)) category = 'lainnya';

    let handoverPoint = null;
    if (type === 'ditemukan') {
      const rawPoint = String(payload.handover_point || 'ruang_piket').toLowerCase();
      handoverPoint = ALLOWED_HANDOVER_POINTS.includes(rawPoint) ? rawPoint : 'ruang_piket';
    }

    const serviceHoursMap = {
      ruang_piket: 'Senin–Jumat 07:00 – 15:30 WIB',
      ruang_bk: 'Senin–Jumat 07:30 – 15:00 WIB',
      pos_satpam: 'Setiap Hari 06:30 – 17:00 WIB',
    };

    const userId = user?.id ? Number(user.id) : 1;
    const nowIso = new Date().toISOString();
    const ticketNumber = `POSIS-LF-${Date.now().toString().slice(-6)}`;

    let uploadedPhotoUrl = null;
    if (photoFile) {
      uploadedPhotoUrl = await uploadItemPhoto(photoFile, ticketNumber);
    } else if (payload.photo_path && typeof payload.photo_path === 'string' && payload.photo_path.length <= 255) {
      uploadedPhotoUrl = payload.photo_path;
    }

    const newItem = {
      ticket_number: ticketNumber,
      user_id: userId,
      type,
      title: String(payload.title || 'Laporan Barang POSIS').slice(0, 150),
      category,
      location: String(payload.location || 'Area SMKN 1 Ciomas').slice(0, 150),
      event_date: payload.event_date || nowIso.split('T')[0],
      description: String(payload.description || payload.title || 'Laporan barang POSIS'),
      photo_path: uploadedPhotoUrl,
      handover_point: handoverPoint,
      service_hours: handoverPoint ? serviceHoursMap[handoverPoint] : null,
      status: 'tersedia',
      moderation_status: 'disetujui',
      created_at: nowIso,
      updated_at: nowIso,
    };

    const { data, error } = await supabase.from('items').insert([newItem]).select().single();

    if (error) {
      console.error('Supabase POST /api/items insert error:', error.message);
      return NextResponse.json(
        { message: `Gagal menyimpan ke Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: {
          ...data,
          reported_by: user?.name || 'Warga SMKN 1 Ciomas',
          photo_url: data.photo_path || null,
        },
        message: 'Laporan barang berhasil disimpan ke Supabase.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/items catch:', err);
    return NextResponse.json(
      { message: err.message || 'Gagal menyimpan laporan barang.' },
      { status: 500 }
    );
  }
}
