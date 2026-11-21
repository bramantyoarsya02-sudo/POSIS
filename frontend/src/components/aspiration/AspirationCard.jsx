import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronUp, MessageSquare, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatDateIndo, calculateSlaDaysLeft, getAspirationStatusBadge } from '../../utils/formatters';
import { aspirationsService } from '../../services/aspirationsService';
import { Badge } from '../common/Badge';

export function AspirationCard({ aspiration, onVoteUpdate, index = 0 }) {
  const [upvotes, setUpvotes] = useState(aspiration.upvotes_count ?? 0);
  const [hasVoted, setHasVoted] = useState(Boolean(aspiration.has_voted));
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    setUpvotes(aspiration.upvotes_count ?? 0);
    setHasVoted(Boolean(aspiration.has_voted));
  }, [aspiration.upvotes_count, aspiration.has_voted]);

  const statusInfo = getAspirationStatusBadge(aspiration.status);
  const sla = calculateSlaDaysLeft(aspiration.created_at);

  const handleVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isVoting) return;

    setIsVoting(true);
    // Optimistic UI update
    const nextVoted = !hasVoted;
    const nextCount = nextVoted ? upvotes + 1 : Math.max(0, upvotes - 1);
    setHasVoted(nextVoted);
    setUpvotes(nextCount);

    try {
      const res = await aspirationsService.toggleVote(aspiration.id);
      const newCount = res?.upvotes_count ?? nextCount;
      const newVoted = res?.has_voted ?? nextVoted;
      setUpvotes(newCount);
      setHasVoted(newVoted);
      if (onVoteUpdate) onVoteUpdate(aspiration.id, newCount, newVoted);
    } catch {
      // rollback
      setUpvotes(aspiration.upvotes_count ?? 0);
      setHasVoted(Boolean(aspiration.has_voted));
    } finally {
      setIsVoting(false);
    }
  };

  // Status Stepper Index (0: Menunggu Review, 1: Diproses, 2: Ditindaklanjuti)
  const steps = [
    { key: 'menunggu_review', label: 'Tinjauan' },
    { key: 'diproses', label: 'Diproses' },
    { key: 'ditindaklanjuti', label: 'Selesai' },
  ];

  const currentStepIndex =
    aspiration.status === 'ditolak'
      ? -1
      : aspiration.status === 'ditindaklanjuti'
      ? 2
      : aspiration.status === 'diproses'
      ? 1
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-white border-2 border-posis-blue rounded-[2px] editorial-shadow p-5 sm:p-6 flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform group"
    >
      <div>
        {/* Top Header: Badge, Emergency Tag, and SLA Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Badge variant="blue">{aspiration.category}</Badge>
            {aspiration.is_emergency && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-posis-lost border border-posis-lost font-mono text-[10px] font-bold uppercase rounded-[2px]">
                <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                DARURAT
              </span>
            )}
            <span className="font-mono text-xs text-stone-500">
              {aspiration.ticket_number}
            </span>
          </div>

          <div className={`px-2 py-0.5 border text-[10px] font-mono font-bold uppercase rounded-[2px] ${statusInfo.bg}`}>
            {statusInfo.label}
          </div>
        </div>

        {/* Title & Author */}
        <div className="mt-3">
          <Link to={`/aspirasi/${aspiration.id}`}>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-posis-ink group-hover:text-posis-blue transition-colors leading-snug">
              {aspiration.title}
            </h4>
          </Link>
          <p className="mt-1 font-mono text-xs text-stone-500">
            {aspiration.is_anonymous ? (
              <span className="text-posis-blue font-semibold">🔒 Siswa SMKN 1 Ciomas (Anonim)</span>
            ) : (
              <span>Oleh: {aspiration.author_name}</span>
            )}
            {' · '}{formatDateIndo(aspiration.created_at)}
          </p>
        </div>

        {/* Body preview */}
        <p className="mt-3 text-xs sm:text-sm text-stone-700 leading-relaxed line-clamp-3">
          {aspiration.body}
        </p>

        {/* Tanggapan Resmi Sekolah jika sudah ada */}
        {aspiration.admin_reply && (
          <div className="mt-3 p-3 bg-blue-50/80 border-l-3 border-posis-blue text-xs rounded-[1px]">
            <span className="font-mono text-[10px] uppercase font-bold text-posis-blue block mb-0.5">
              RESPONS RESMI SEKOLAH / OSIS:
            </span>
            <p className="text-stone-800 line-clamp-2 italic">
              "{aspiration.admin_reply}"
            </p>
          </div>
        )}

        {/* Horizontal Status Progress Tracker Stepper */}
        {aspiration.status !== 'ditolak' && (
          <div className="mt-4 pt-3 border-t border-stone-200">
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-600 mb-1">
              <span className="font-semibold text-posis-ink">PROGRES PENANGANAN:</span>
              <span className="text-posis-blue font-bold">
                {steps[Math.max(0, currentStepIndex)]?.label.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 h-1.5 bg-stone-200 rounded-[1px] overflow-hidden">
              {steps.map((st, sIdx) => (
                <div
                  key={st.key}
                  className={`h-full transition-all duration-300 ${
                    sIdx <= currentStepIndex
                      ? sIdx === 2
                        ? 'bg-posis-found'
                        : 'bg-posis-blue'
                      : 'bg-stone-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Card: Upvote button & SLA Day tracker */}
      <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
        {/* Tombol Upvote Bereaksi dengan Angka Naik */}
        <button
          onClick={handleVote}
          className={`flex items-center gap-2 px-3 py-1.5 border-2 transition-all rounded-[2px] ${
            hasVoted
              ? 'bg-posis-gold text-posis-ink border-posis-ink font-bold editorial-shadow-sm'
              : 'bg-white text-stone-700 border-stone-400 hover:border-posis-blue hover:text-posis-blue'
          }`}
        >
          <motion.div
            animate={hasVoted ? { y: [-2, 2, 0], scale: [1, 1.25, 1] } : {}}
            transition={{ duration: 0.25 }}
          >
            <ChevronUp className={`w-4 h-4 stroke-[3] ${hasVoted ? 'text-posis-ink' : 'text-posis-blue'}`} />
          </motion.div>
          <span className="font-mono text-xs font-bold">{upvotes} Dukungan</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Komitmen respons 7 hari kerja */}
          <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-stone-500">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            {sla.isOverdue ? (
              <span className="text-posis-lost font-semibold">Lewat SLA ({Math.abs(sla.remainingDays)}h)</span>
            ) : (
              <span>Sisa {sla.remainingDays} hari SLA</span>
            )}
          </div>

          <Link
            to={`/aspirasi/${aspiration.id}`}
            className="flex items-center gap-1 text-xs font-mono font-medium text-posis-blue hover:underline"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{aspiration.comments_count || 0}</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
