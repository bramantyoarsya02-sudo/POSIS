/**
 * Utility Export Laporan Admin POSIS (Word .doc & Excel .xls)
 * Menghasilkan dokumen resmi berformat Kop Surat SMK Negeri 1 Ciomas
 * yang kompatibel penuh dengan Microsoft Word & Microsoft Excel.
 */

const escapeHtml = (val) => {
  if (val === null || val === undefined) return '-';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const formatDateId = (dateInput) => {
  if (!dateInput) return '-';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return String(dateInput);
  }
};

const getNowFormatted = () => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
};

const getFileDateStamp = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const triggerDownload = (content, filename, mimeType) => {
  const blob = new Blob(['\ufeff', content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

/**
 * Membangun dokumen Microsoft Word (.doc) lengkap dengan Kop Surat Sekolah
 */
const buildWordDocument = ({ title, subtitle, adminName, bodyHtml }) => {
  const printedAt = getNowFormatted();
  return `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: A4 landscape;
      margin: 1.5cm 1.5cm 1.5cm 1.5cm;
    }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 11pt;
      color: #111827;
      line-height: 1.4;
    }
    .kop-surat {
      text-align: center;
      border-bottom: 3px double #1F3F94;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }
    .kop-instansi {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .kop-sekolah {
      font-size: 16pt;
      font-weight: bold;
      color: #1F3F94;
      text-transform: uppercase;
      margin: 2px 0;
    }
    .kop-sub {
      font-size: 10pt;
      font-weight: bold;
      margin: 2px 0;
    }
    .kop-alamat {
      font-size: 9pt;
      color: #4B5563;
      margin: 2px 0 0 0;
    }
    .report-header {
      margin-bottom: 14px;
    }
    .report-title {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
      margin: 0 0 4px 0;
    }
    .report-subtitle {
      font-size: 10pt;
      text-align: center;
      color: #374151;
      margin: 0 0 10px 0;
    }
    .meta-info {
      font-size: 9.5pt;
      margin-bottom: 12px;
      width: 100%;
    }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      color: #1F3F94;
      text-transform: uppercase;
      margin: 16px 0 6px 0;
      border-left: 4px solid #F2B705;
      padding-left: 8px;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9.5pt;
    }
    table.data-table th {
      background-color: #1F3F94;
      color: #FFFFFF;
      font-weight: bold;
      text-transform: uppercase;
      padding: 6px 8px;
      border: 1px solid #1F3F94;
      text-align: left;
    }
    table.data-table td {
      padding: 6px 8px;
      border: 1px solid #CBD5E1;
      vertical-align: top;
    }
    table.data-table tr:nth-child(even) td {
      background-color: #F8FAFC;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    .signature-box {
      margin-top: 28px;
      width: 100%;
    }
    .signature-cell {
      width: 35%;
      text-align: center;
      font-size: 10pt;
    }
  </style>
</head>
<body>
  <div class="kop-surat">
    <p class="kop-instansi">PEMERINTAH DAERAH PROVINSI JAWA BARAT — DINAS PENDIDIKAN</p>
    <p class="kop-sekolah">SMK NEGERI 1 CIOMAS</p>
    <p class="kop-sub">PORTAL LAYANAN INFORMASI &amp; SUARA SISWA (POSIS)</p>
    <p class="kop-alamat">Jl. Raya Laladon, Desa Laladon, Kec. Ciomas, Kabupaten Bogor, Jawa Barat 16610</p>
  </div>

  <div class="report-header">
    <p class="report-title">${escapeHtml(title)}</p>
    ${subtitle ? `<p class="report-subtitle">${escapeHtml(subtitle)}</p>` : ''}
  </div>

  <table class="meta-info" border="0" cellpadding="2" cellspacing="0">
    <tr>
      <td width="15%"><strong>Dicetak Oleh</strong></td>
      <td width="35%">: ${escapeHtml(adminName || 'Administrator POSIS')}</td>
      <td width="15%"><strong>Waktu Cetak</strong></td>
      <td width="35%">: ${escapeHtml(printedAt)} WIB</td>
    </tr>
  </table>

  ${bodyHtml}

  <table class="signature-box" border="0">
    <tr>
      <td width="65%"></td>
      <td class="signature-cell">
        <p>Ciomas, ${escapeHtml(new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()))}</p>
        <p><strong>Pengelola Sistem POSIS / Kesiswaan</strong></p>
        <br><br><br>
        <p><strong><u>${escapeHtml(adminName || 'Administrator POSIS')}</u></strong></p>
        <p>SMK Negeri 1 Ciomas</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Membangun dokumen Microsoft Excel (.xls) lengkap dengan format sel & header
 */
const buildExcelDocument = ({ sheetName, title, subtitle, adminName, bodyHtml }) => {
  const printedAt = getNowFormatted();
  const safeSheet = (sheetName || 'Laporan POSIS').substring(0, 30);
  return `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>${escapeHtml(safeSheet)}</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
    }
    .title-row {
      font-size: 14pt;
      font-weight: bold;
      color: #1F3F94;
    }
    .subtitle-row {
      font-size: 10pt;
      font-weight: bold;
      color: #374151;
    }
    .meta-row {
      font-size: 9pt;
      color: #4B5563;
    }
    table.data-table {
      border-collapse: collapse;
      width: 100%;
    }
    table.data-table th {
      background-color: #1F3F94;
      color: #FFFFFF;
      font-weight: bold;
      padding: 8px;
      border: 1px solid #1F3F94;
      text-align: left;
    }
    table.data-table td {
      padding: 6px 8px;
      border: 1px solid #CBD5E1;
      vertical-align: top;
    }
    .text-str {
      mso-number-format: "\\@";
    }
    .text-center {
      text-align: center;
    }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      color: #1F3F94;
      margin-top: 14px;
      margin-bottom: 6px;
    }
  </style>
</head>
<body>
  <table>
    <tr><td colspan="8" class="title-row">SMK NEGERI 1 CIOMAS - PORTAL POSIS</td></tr>
    <tr><td colspan="8" class="subtitle-row">${escapeHtml(title)}</td></tr>
    ${subtitle ? `<tr><td colspan="8" class="meta-row">${escapeHtml(subtitle)}</td></tr>` : ''}
    <tr><td colspan="8" class="meta-row">Dicetak oleh: ${escapeHtml(adminName || 'Administrator POSIS')} | Waktu: ${escapeHtml(printedAt)} WIB</td></tr>
    <tr><td colspan="8"></td></tr>
  </table>
  ${bodyHtml}
</body>
</html>`;
};

/* ==========================================================================
 * BUILDER TABEL HTML UNTUK MASING-MASING MODUL
 * ========================================================================== */

export const buildOverviewTableHtml = (dashboardData) => {
  const stats = dashboardData?.stats || {};
  const lf = stats.lostFound || {};
  const asp = stats.aspirations || {};
  const trends = dashboardData?.monthlyTrends || [];
  const activities = dashboardData?.recentActivities || [];

  return `
    <div class="section-title">1. Ringkasan Statistik Sistem</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Indikator / Kategori Layanan</th>
          <th>Rincian Status</th>
          <th class="text-center">Total Data</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Total Siswa Terdaftar</strong></td>
          <td>Akun Peserta Didik Terverifikasi</td>
          <td class="text-center"><strong>${escapeHtml(stats.totalStudents ?? 0)}</strong></td>
        </tr>
        <tr>
          <td><strong>Laporan Lost &amp; Found (Barang Hilang &amp; Temuan)</strong></td>
          <td>Hilang: ${escapeHtml(lf.hilang ?? 0)} | Ditemukan: ${escapeHtml(lf.ditemukan ?? 0)} | Selesai: ${escapeHtml(lf.selesai ?? 0)}</td>
          <td class="text-center"><strong>${escapeHtml(lf.total ?? 0)}</strong></td>
        </tr>
        <tr>
          <td><strong>Laporan Aspirasi &amp; Suara Siswa</strong></td>
          <td>Baru: ${escapeHtml(asp.baru ?? 0)} | Diproses: ${escapeHtml(asp.diproses ?? 0)} | Selesai: ${escapeHtml(asp.selesai ?? 0)}</td>
          <td class="text-center"><strong>${escapeHtml(asp.total ?? 0)}</strong></td>
        </tr>
        <tr>
          <td><strong>Kunjungan &amp; Aktivitas Hari Ini</strong></td>
          <td>Trafik Aktif Harian Portal POSIS</td>
          <td class="text-center"><strong>${escapeHtml(stats.todayVisitors ?? 0)}</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">2. Tren Bulanan (6 Bulan Terakhir)</div>
    <table class="data-table">
      <thead>
        <tr>
          <th class="text-center">No</th>
          <th>Bulan</th>
          <th class="text-center">Jumlah Laporan Lost &amp; Found</th>
          <th class="text-center">Jumlah Aspirasi Masuk</th>
          <th class="text-center">Total Laporan</th>
        </tr>
      </thead>
      <tbody>
        ${
          trends.length
            ? trends
                .map(
                  (t, i) => `
          <tr>
            <td class="text-center">${i + 1}</td>
            <td><strong>${escapeHtml(t.month)}</strong></td>
            <td class="text-center">${escapeHtml(t.lostFound ?? 0)}</td>
            <td class="text-center">${escapeHtml(t.aspiration ?? 0)}</td>
            <td class="text-center"><strong>${(Number(t.lostFound) || 0) + (Number(t.aspiration) || 0)}</strong></td>
          </tr>`
                )
                .join('')
            : `<tr><td colspan="5" class="text-center">Belum ada data tren bulanan.</td></tr>`
        }
      </tbody>
    </table>

    <div class="section-title">3. Aktivitas Terbaru Sistem</div>
    <table class="data-table">
      <thead>
        <tr>
          <th class="text-center">No</th>
          <th>Deskripsi Aktivitas / Laporan</th>
          <th>Pelapor / Pengguna</th>
          <th>Kategori</th>
          <th>Waktu</th>
        </tr>
      </thead>
      <tbody>
        ${
          activities.length
            ? activities
                .map(
                  (a, i) => `
          <tr>
            <td class="text-center">${i + 1}</td>
            <td>${escapeHtml(a.title)}</td>
            <td>${escapeHtml(a.author)}</td>
            <td>${escapeHtml(a.badge)}</td>
            <td>${escapeHtml(a.created_at)}</td>
          </tr>`
                )
                .join('')
            : `<tr><td colspan="5" class="text-center">Belum ada aktivitas terbaru.</td></tr>`
        }
      </tbody>
    </table>
  `;
};

export const buildStudentsTableHtml = (students = []) => `
  <div class="section-title">Data Akun Peserta Didik (${students.length} Siswa)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th class="text-center">No</th>
        <th>Nama Lengkap Siswa</th>
        <th>NIS / NISN</th>
        <th>Kelas / Kompetensi Keahlian</th>
        <th>Email Sekolah</th>
        <th class="text-center">Status Akun</th>
      </tr>
    </thead>
    <tbody>
      ${
        students.length
          ? students
              .map(
                (st, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td><strong>${escapeHtml(st.name)}</strong></td>
          <td class="text-str">${escapeHtml(st.nisn || '-')}</td>
          <td>${escapeHtml(st.class_or_division || '-')}</td>
          <td>${escapeHtml(st.email || '-')}</td>
          <td class="text-center">${st.is_active ? 'AKTIF' : 'NONAKTIF'}</td>
        </tr>`
              )
              .join('')
          : `<tr><td colspan="6" class="text-center">Tidak ada data siswa.</td></tr>`
      }
    </tbody>
  </table>
`;

export const buildItemsTableHtml = (items = []) => `
  <div class="section-title">Daftar Laporan Lost &amp; Found (${items.length} Laporan)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th class="text-center">No</th>
        <th>No. Tiket</th>
        <th>Nama / Judul Barang</th>
        <th class="text-center">Tipe</th>
        <th>Kategori</th>
        <th>Lokasi Kejadian</th>
        <th>Titik Piket</th>
        <th>Pelapor</th>
        <th class="text-center">Status</th>
        <th>Tanggal Lapor</th>
      </tr>
    </thead>
    <tbody>
      ${
        items.length
          ? items
              .map(
                (it, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td class="text-str"><strong>${escapeHtml(it.ticket_number)}</strong></td>
          <td><strong>${escapeHtml(it.title)}</strong><br/><small>${escapeHtml(it.description || '')}</small></td>
          <td class="text-center">${escapeHtml((it.type || '').toUpperCase())}</td>
          <td>${escapeHtml(it.category || '-')}</td>
          <td>${escapeHtml(it.location || '-')}</td>
          <td>${escapeHtml(it.handover_point || 'Ruang Piket')}</td>
          <td>${escapeHtml(it.reported_by || '-')}</td>
          <td class="text-center"><strong>${escapeHtml((it.status || '').toUpperCase())}</strong></td>
          <td>${escapeHtml(formatDateId(it.created_at || it.event_date))}</td>
        </tr>`
              )
              .join('')
          : `<tr><td colspan="10" class="text-center">Tidak ada data laporan barang.</td></tr>`
      }
    </tbody>
  </table>
`;

export const buildClaimsTableHtml = (claims = []) => `
  <div class="section-title">Daftar Pengajuan Klaim Kepemilikan Barang (${claims.length} Klaim)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th class="text-center">No</th>
        <th>No. Klaim</th>
        <th>Nama Pengklaim</th>
        <th>NISN &amp; Kelas</th>
        <th>Barang yang Diklaim</th>
        <th>Ciri Khusus Rahasia</th>
        <th>Catatan Verifikasi</th>
        <th class="text-center">Status Klaim</th>
        <th>Waktu Pengajuan</th>
      </tr>
    </thead>
    <tbody>
      ${
        claims.length
          ? claims
              .map(
                (cl, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td class="text-str"><strong>${escapeHtml(cl.claim_number)}</strong></td>
          <td><strong>${escapeHtml(cl.claimant_name)}</strong></td>
          <td class="text-str">${escapeHtml(cl.claimant_nisn || '-')} (${escapeHtml(cl.claimant_class || '-')})</td>
          <td><strong>${escapeHtml(cl.item_title)}</strong> (${escapeHtml(cl.item_ticket || '-')})</td>
          <td>${escapeHtml(cl.proof_description || '-')}</td>
          <td>${escapeHtml(cl.verification_note || '-')}</td>
          <td class="text-center"><strong>${escapeHtml((cl.status || '').toUpperCase())}</strong></td>
          <td>${escapeHtml(cl.created_at || '-')}</td>
        </tr>`
              )
              .join('')
          : `<tr><td colspan="9" class="text-center">Tidak ada data klaim barang.</td></tr>`
      }
    </tbody>
  </table>
`;

export const buildAspirationsTableHtml = (aspirations = []) => `
  <div class="section-title">Daftar Laporan Aspirasi &amp; Suara Siswa (${aspirations.length} Aspirasi)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th class="text-center">No</th>
        <th>No. Tiket</th>
        <th>Kategori</th>
        <th>Judul &amp; Isi Aspirasi</th>
        <th>Pengirim</th>
        <th class="text-center">Dukungan</th>
        <th class="text-center">Status</th>
        <th>Tanggapan Resmi Sekolah</th>
        <th>Tanggal Masuk</th>
      </tr>
    </thead>
    <tbody>
      ${
        aspirations.length
          ? aspirations
              .map(
                (asp, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td class="text-str"><strong>${escapeHtml(asp.ticket_number)}</strong></td>
          <td>${escapeHtml((asp.category || '').toUpperCase())}</td>
          <td><strong>${escapeHtml(asp.title)}</strong><br/>${escapeHtml(asp.body || '')}</td>
          <td>${escapeHtml(asp.author_name || (asp.is_anonymous ? 'Anonim' : 'Siswa'))}</td>
          <td class="text-center">${escapeHtml(asp.upvotes_count ?? 0)}</td>
          <td class="text-center"><strong>${escapeHtml((asp.status || '').toUpperCase())}</strong></td>
          <td>${escapeHtml(asp.admin_reply || 'Belum ada tanggapan resmi')}</td>
          <td>${escapeHtml(formatDateId(asp.created_at))}</td>
        </tr>`
              )
              .join('')
          : `<tr><td colspan="9" class="text-center">Tidak ada data aspirasi siswa.</td></tr>`
      }
    </tbody>
  </table>
`;

export const buildCommentsTableHtml = (comments = []) => `
  <div class="section-title">Daftar Komentar Diskusi Aspirasi (${comments.length} Komentar)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th class="text-center">No</th>
        <th>Penulis Komentar</th>
        <th>Kelas / Peran</th>
        <th>Aspirasi Terkait</th>
        <th>Isi Tanggapan / Komentar</th>
        <th class="text-center">Tipe</th>
        <th>Waktu Komentar</th>
      </tr>
    </thead>
    <tbody>
      ${
        comments.length
          ? comments
              .map(
                (cm, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td><strong>${escapeHtml(cm.author_name)}</strong></td>
          <td>${escapeHtml(cm.author_class || '-')}</td>
          <td><strong>${escapeHtml(cm.aspiration_title)}</strong> (${escapeHtml(cm.aspiration_ticket || '-')})</td>
          <td>${escapeHtml(cm.body || '')}</td>
          <td class="text-center">${cm.is_official_reply ? 'RESMI SEKOLAH' : 'WARGA SEKOLAH'}</td>
          <td>${escapeHtml(cm.created_at || '-')}</td>
        </tr>`
              )
              .join('')
          : `<tr><td colspan="7" class="text-center">Tidak ada data komentar diskusi.</td></tr>`
      }
    </tbody>
  </table>
`;

export const buildFaqsTableHtml = (faqs = []) => `
  <div class="section-title">Daftar Panduan &amp; FAQ Sistem POSIS (${faqs.length} Item)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th class="text-center">No</th>
        <th>Kategori</th>
        <th>Pertanyaan</th>
        <th>Jawaban Resmi Panduan</th>
      </tr>
    </thead>
    <tbody>
      ${
        faqs.length
          ? faqs
              .map(
                (fq, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td>${escapeHtml((fq.category || 'general').toUpperCase())}</td>
          <td><strong>${escapeHtml(fq.question)}</strong></td>
          <td>${escapeHtml(fq.answer)}</td>
        </tr>`
              )
              .join('')
          : `<tr><td colspan="4" class="text-center">Tidak ada data panduan &amp; FAQ.</td></tr>`
      }
    </tbody>
  </table>
`;

/**
 * Fungsi utama untuk mengekspor laporan ke Word (.doc) atau Excel (.xls)
 */
export const exportAdminReport = ({
  format = 'word', // 'word' | 'excel'
  reportType = 'overview',
  title,
  subtitle,
  adminName,
  bodyHtml,
}) => {
  const stamp = getFileDateStamp();
  const safeType = reportType.toUpperCase();

  if (format === 'word') {
    const html = buildWordDocument({ title, subtitle, adminName, bodyHtml });
    triggerDownload(
      html,
      `Laporan_POSIS_${safeType}_${stamp}.doc`,
      'application/msword'
    );
  } else {
    const html = buildExcelDocument({
      sheetName: `POSIS_${safeType}`,
      title,
      subtitle,
      adminName,
      bodyHtml,
    });
    triggerDownload(
      html,
      `Laporan_POSIS_${safeType}_${stamp}.xls`,
      'application/vnd.ms-excel'
    );
  }
};

