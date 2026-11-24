/**
 * Format tanggal standar Indonesia
 */
export function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Format tanggal singkat dengan jam
 */
export function formatDateTimeIndo(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date) + ' WIB';
}

/**
 * Hitung sisa hari komitmen respons SLA 7 hari
 */
export function calculateSlaDaysLeft(createdAtStr, slaDays = 7) {
  const created = new Date(createdAtStr);
  const now = new Date();
  const diffTime = now - created;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const remaining = slaDays - diffDays;
  return {
    elapsedDays: diffDays,
    remainingDays: remaining,
    isOverdue: remaining < 0
  };
}

/**
 * Label status Lost & Found
 */
export function getItemStatusBadge(status, type) {
  switch (status) {
    case 'tersedia':
      return {
        label: type === 'hilang' ? 'HILANG' : 'DITEMUKAN',
        bg: type === 'hilang' ? 'bg-red-100 text-posis-lost border-posis-lost' : 'bg-emerald-100 text-posis-found border-posis-found'
      };
    case 'diklaim':
      return { label: 'PROSES KLAIM', bg: 'bg-amber-100 text-posis-process border-posis-process' };
    case 'selesai':
      return { label: 'SELESAI / DIAMBIL', bg: 'bg-stone-200 text-posis-done border-stone-400' };
    default:
      return { label: status?.toUpperCase(), bg: 'bg-stone-100 text-posis-ink border-stone-300' };
  }
}

/**
 * Label status Aspirasi
 */
export function getAspirationStatusBadge(status) {
  switch (status) {
    case 'menunggu_review':
      return { label: 'MENUNGGU TINJAUAN', bg: 'bg-stone-100 text-stone-700 border-stone-400' };
    case 'diproses':
      return { label: 'DIPROSES SEKOLAH', bg: 'bg-blue-100 text-posis-blue border-posis-blue' };
    case 'ditindaklanjuti':
      return { label: 'TELAH DITINDAKLANJUTI', bg: 'bg-emerald-100 text-posis-found border-posis-found' };
    case 'ditolak':
      return { label: 'DITOLAK DENGAN ALASAN', bg: 'bg-red-100 text-posis-lost border-posis-lost' };
    default:
      return { label: status?.toUpperCase(), bg: 'bg-stone-100 text-stone-600 border-stone-300' };
  }
}
