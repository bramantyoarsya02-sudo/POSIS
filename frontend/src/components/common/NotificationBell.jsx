import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  Package, 
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifs = async () => {
    const token = localStorage.getItem('posis_token');
    if (!token) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    notificationService.markAllAsRead(allIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleItemClick = (notif) => {
    notificationService.markAsRead(notif.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getIcon = (notif) => {
    if (notif.badge_type === 'success') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
    }
    if (notif.badge_type === 'danger') {
      return <XCircle className="w-4 h-4 text-red-600 shrink-0" />;
    }
    if (notif.badge_type === 'info') {
      return <Clock className="w-4 h-4 text-blue-600 shrink-0" />;
    }
    if (notif.badge_type === 'warning') {
      return <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />;
    }
    return <MessageSquare className="w-4 h-4 text-posis-blue shrink-0" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (next) fetchNotifs();
        }}
        title="Notifikasi Aktivitas"
        className="relative p-2 rounded-[2px] border border-stone-300 bg-white hover:border-posis-blue hover:text-posis-blue text-stone-700 transition-colors shadow-sm flex items-center justify-center"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse border border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border-2 border-posis-blue rounded-[2px] editorial-shadow-dark z-50 overflow-hidden text-posis-ink animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header Dropdown */}
          <div className="p-3.5 bg-posis-blue text-white flex items-center justify-between border-b border-posis-blue-dark">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-posis-gold" />
              <h3 className="font-serif text-sm font-bold tracking-wide">
                Notifikasi Siswa
              </h3>
            </div>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-mono text-posis-gold hover:text-white flex items-center gap-1 transition-colors"
                title="Tandai semua notifikasi telah dibaca"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Tandai Semua Dibaca</span>
              </button>
            )}
          </div>

          {/* List Notifikasi */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 bg-posis-bone/30">
            {notifications.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center mx-auto text-stone-400 mb-2">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="font-bold text-xs text-posis-ink">
                  Belum Ada Notifikasi
                </p>
                <p className="text-[11px] text-stone-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
                  Pemberitahuan klaim barang diterima/ditolak dan tindak lanjut aspirasi Anda akan muncul di sini.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3 text-left transition-colors cursor-pointer flex gap-3 items-start hover:bg-posis-gold/10 ${
                    item.is_read ? 'bg-white opacity-80' : 'bg-blue-50/60 font-medium'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 p-1.5 bg-white border border-stone-200 rounded-[2px] shadow-2xs">
                    {getIcon(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-xs font-bold text-posis-ink truncate">
                        {item.title}
                      </p>
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-snug line-clamp-2">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-stone-100/80 font-mono text-[10px] text-stone-600">
                      <span>{item.created_at_human}</span>
                      <span className="text-posis-blue hover:underline flex items-center gap-0.5">
                        Lihat <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Dropdown */}
          <div className="p-2 bg-stone-100 border-t border-stone-200 text-center font-mono text-[10px] text-stone-600">
            Sistem Pembaruan Otomatis POSIS SMKN 1 Ciomas
          </div>
        </div>
      )}
    </div>
  );
}
