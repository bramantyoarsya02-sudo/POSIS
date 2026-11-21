import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronUp, MessageSquare, Clock, ShieldCheck, AlertTriangle, Send } from 'lucide-react';
import { aspirationsService } from '../../services/aspirationsService';
import { formatDateIndo, calculateSlaDaysLeft, getAspirationStatusBadge } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function AspirasiDetail() {
  const { id } = useParams();
  const [aspiration, setAspiration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await aspirationsService.getAspirationById(id);
        setAspiration(data);
        if (data && data.comments && Array.isArray(data.comments)) {
          setComments(data.comments);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.error("Gagal memuat aspirasi:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center font-mono text-sm">
        Memuat detail aspirasi...
      </div>
    );
  }

  if (!aspiration) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-3xl font-bold text-posis-lost mb-2">Aspirasi Tidak Ditemukan</h2>
        <Link to="/aspirasi">
          <Button variant="outline">Kembali ke Papan Aspirasi</Button>
        </Link>
      </div>
    );
  }

  const statusInfo = getAspirationStatusBadge(aspiration.status);
  const sla = calculateSlaDaysLeft(aspiration.created_at);

  const handleVote = async () => {
    const res = await aspirationsService.toggleVote(aspiration.id);
    const newCount = res?.upvotes_count ?? (aspiration.has_voted ? Math.max(0, aspiration.upvotes_count - 1) : (aspiration.upvotes_count || 0) + 1);
    const newVoted = res?.has_voted ?? !aspiration.has_voted;
    setAspiration({ ...aspiration, upvotes_count: newCount, has_voted: newVoted });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    setCommentError('');
    try {
      const newComment = await aspirationsService.addComment(aspiration.id, commentText.trim());
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
      setAspiration((prev) => prev ? { ...prev, comments_count: (prev.comments_count || 0) + 1 } : prev);
    } catch (err) {
      setCommentError(err.message || 'Gagal mengirim komentar.');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="py-8 md:py-12 bg-posis-bone min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <Link
          to="/aspirasi"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-posis-blue uppercase hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          KEMBALI KE KOTAK ASPIRASI
        </Link>

        {/* Main Editorial Card */}
        <div className="bg-white border-2 border-posis-blue rounded-[2px] editorial-shadow overflow-hidden mb-8">
          {/* Header Bar */}
          <div className="px-6 py-4 bg-stone-100 border-b-2 border-posis-blue flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-stone-500 uppercase">TIKET</span>
              <span className="font-mono text-sm font-bold text-posis-blue">{aspiration.ticket_number}</span>
              <Badge variant="blue">{aspiration.category}</Badge>
              {aspiration.is_emergency && (
                <span className="px-2 py-0.5 bg-red-100 text-posis-lost border border-posis-lost font-mono text-[10px] font-bold uppercase rounded-[2px]">
                  DARURAT
                </span>
              )}
            </div>
            <div className={`px-3 py-1 border text-xs font-mono font-bold uppercase rounded-[2px] ${statusInfo.bg}`}>
              {statusInfo.label}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-posis-ink leading-tight">
                {aspiration.title}
              </h1>
              <p className="mt-2 font-mono text-xs text-stone-500">
                {aspiration.is_anonymous ? (
                  <span className="text-posis-blue font-semibold">🔒 Siswa SMKN 1 Ciomas (Identitas Dilindungi / Anonim)</span>
                ) : (
                  <span>Disampaikan oleh: {aspiration.author_name}</span>
                )}
                {' · '}{formatDateIndo(aspiration.created_at)}
              </p>
            </div>

            {/* SLA Commitment Indicator */}
            <div className="p-4 bg-posis-bone border border-stone-300 rounded-[2px] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <Clock className="w-4 h-4 text-posis-blue shrink-0" />
                <span>
                  Standar Komitmen Respons: <strong>Maksimal 7 Hari Kerja</strong>
                </span>
              </div>
              <div className="font-mono font-bold text-posis-blue">
                {sla.isOverdue ? (
                  <span className="text-posis-lost">Telah Lewat Target ({Math.abs(sla.remainingDays)} hari)</span>
                ) : (
                  <span>Sisa Waktu Respons: {sla.remainingDays} Hari</span>
                )}
              </div>
            </div>

            {/* Uraian Masalah */}
            <div className="space-y-2">
              <h3 className="font-mono text-xs uppercase font-bold text-stone-700 tracking-wider">
                URAIAN DAN USULAN:
              </h3>
              <p className="text-sm sm:text-base text-stone-800 leading-relaxed whitespace-pre-line bg-stone-50/50 p-4 border border-stone-200 rounded-[2px]">
                {aspiration.body}
              </p>
            </div>

            {/* Respons Resmi Sekolah */}
            {aspiration.admin_reply && (
              <div className="p-4 bg-blue-50 border-2 border-posis-blue rounded-[2px] space-y-2">
                <span className="font-mono text-xs font-bold text-posis-blue uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  TANGGAPAN RESMI SARANA &amp; PRASARANA / OSIS
                </span>
                <p className="text-sm text-stone-800 italic leading-relaxed">
                  "{aspiration.admin_reply}"
                </p>
              </div>
            )}

            {/* Linimasa / Stepper Tindak Lanjut */}
            <div className="pt-4 border-t border-stone-200">
              <h3 className="font-mono text-xs uppercase font-bold text-stone-700 tracking-wider mb-4">
                LINIMASA TINDAK LANJUT RESMI:
              </h3>

              <div className="space-y-4">
                {aspiration.timeline?.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-posis-blue border-2 border-white ring-2 ring-posis-blue" />
                      {idx < aspiration.timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-stone-300 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 bg-posis-bone p-3 border border-stone-300 rounded-[2px]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-posis-ink font-mono">{step.label}</span>
                        <span className="font-mono text-[10px] text-stone-500">{step.date}</span>
                      </div>
                      <p className="text-xs text-stone-600">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar (Upvote Button) */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={handleVote}
                className={`flex items-center gap-2 px-4 py-2 border-2 transition-all rounded-[2px] ${
                  aspiration.has_voted
                    ? 'bg-posis-gold text-posis-ink border-posis-ink font-bold editorial-shadow-sm'
                    : 'bg-white text-stone-700 border-stone-400 hover:border-posis-blue'
                }`}
              >
                <ChevronUp className="w-5 h-5 stroke-[3] text-posis-blue" />
                <span className="font-mono text-sm font-bold">
                  {aspiration.upvotes_count} Dukungan Siswa
                </span>
              </button>

              <span className="font-mono text-xs text-stone-500">
                {comments.length} Komentar Diskusi
              </span>
            </div>
          </div>
        </div>

        {/* Diskusi & Komentar Warga Sekolah */}
        <div className="bg-white border-2 border-posis-blue rounded-[2px] p-6 sm:p-8 editorial-shadow">
          <h3 className="font-serif text-2xl font-bold text-posis-ink mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-posis-blue" />
            Diskusi Warga Sekolah
          </h3>

          {/* Form Komentar */}
          <form onSubmit={handleAddComment} className="mb-6 space-y-3">
            {commentError && (
              <div className="p-3 bg-red-50 border border-posis-lost text-posis-lost text-xs rounded-[2px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{commentError}</span>
              </div>
            )}
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tulis tanggapan atau pengalaman Anda terkait usulan fasilitas ini..."
              className="w-full px-3 py-2 text-sm bg-posis-bone border border-stone-400 focus:border-posis-blue rounded-[2px] outline-none"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="blue" size="sm" icon={Send} disabled={submittingComment}>
                {submittingComment ? 'Mengirim...' : 'Kirim Komentar'}
              </Button>
            </div>
          </form>

          {/* List Komentar */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-stone-300 rounded-[2px] bg-stone-50">
                <p className="font-mono text-xs text-stone-500">
                  Belum ada komentar pada aspirasi ini. Jadilah yang pertama memberikan tanggapan!
                </p>
              </div>
            ) : (
              comments.map((c) => {
                const isOfficial = Boolean(c.isOfficial || c.is_official_reply);
                return (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-[2px] border ${
                      isOfficial
                        ? 'bg-blue-50/70 border-posis-blue'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-bold font-mono ${isOfficial ? 'text-posis-blue' : 'text-posis-ink'}`}>
                        {c.author} {isOfficial && '(Resmi)'}
                      </span>
                      <span className="font-mono text-[10px] text-stone-400">{c.time || c.created_at}</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">{c.body || c.text}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
