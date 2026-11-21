import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Building, Share2 } from 'lucide-react';
import { formatDateIndo, getItemStatusBadge } from '../../utils/formatters';
import { Button } from '../common/Button';

export function ItemCard({ item, onClaimClick, index = 0 }) {
  const statusInfo = getItemStatusBadge(item.status, item.type);

  const handleShareWa = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const text = encodeURIComponent(
      `[POSIS SMKN 1 CIOMAS]\nInformasi Barang ${item.type === 'hilang' ? 'HILANG' : 'DITEMUKAN'}:\n*${item.title}*\nLokasi: ${item.location}\nTanggal: ${formatDateIndo(item.event_date)}\nCek selengkapnya di portal POSIS SMKN 1 Ciomas.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-white border-2 border-posis-blue rounded-[2px] editorial-shadow flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform group overflow-hidden"
    >
      <div>
        {/* Top Header Card: Ticket & Falling Pin Status */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <span className="font-mono text-[11px] text-stone-600 font-medium">
            {item.ticket_number}
          </span>

          {/* Pin Status Jatuh dan Memantul Ringan */}
          <motion.div
            initial={{ y: -16, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 18,
              delay: 0.1 + index * 0.05
            }}
            className={`px-2.5 py-0.5 border text-[10px] font-mono font-bold tracking-wider uppercase rounded-[2px] ${statusInfo.bg}`}
          >
            {statusInfo.label}
          </motion.div>
        </div>

        {/* Foto Barang jika tersedia */}
        {item.photo_url && (
          <div className="w-full h-44 bg-stone-100 overflow-hidden border-b border-stone-200 relative">
            <img
              src={item.photo_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
            />
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/75 text-white font-mono text-[10px] font-bold rounded-[2px] backdrop-blur-xs flex items-center gap-1">
              📷 Foto Fisik
            </span>
          </div>
        )}

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-posis-ink group-hover:text-posis-blue transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h4>

          {/* Metadata */}
          <div className="mt-3 space-y-1.5 text-xs text-stone-600 font-sans">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-posis-blue shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-posis-blue shrink-0" />
              <span>{formatDateIndo(item.event_date)}</span>
            </div>
            {item.handover_point && (
              <div className="flex items-center gap-2 text-amber-900 bg-amber-50 p-1.5 border border-posis-gold/60 rounded-[2px] mt-2">
                <Building className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span className="font-mono text-[11px] font-medium truncate">
                  Disimpan di: {item.handover_point.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Footer Card Actions */}
      <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
        <button
          onClick={handleShareWa}
          title="Bagikan ke WhatsApp"
          className="p-2 border border-stone-300 hover:border-emerald-600 hover:text-emerald-700 bg-white rounded-[2px] text-stone-600 transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {item.type === 'ditemukan' && item.status === 'tersedia' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onClaimClick && onClaimClick(item)}
            >
              Klaim Barang
            </Button>
          )}
          <Link to={`/lost-found/${item.id}`}>
            <Button size="sm" variant="outline">
              Detail
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
