'use client';

import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '../../config/site';

export function Footer() {
  return (
    <footer className="bg-posis-ink text-white border-t-4 border-posis-gold pt-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/15">
          {/* Brand & Alamat Sekolah */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white p-1 rounded-[2px] border border-posis-gold flex items-center justify-center">
                <img
                  src="/assets/logo-smkn1-ciomas.png"
                  alt="Logo SMK Negeri 1 Ciomas"
                  width="48"
                  height="48"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                  POSIS
                </h3>
                <p className="font-mono text-xs text-posis-gold font-medium">
                  SMK NEGERI 1 CIOMAS · KABUPATEN BOGOR
                </p>
              </div>
            </div>

            <p className="text-sm text-white/80 leading-relaxed max-w-sm">
              Layanan digital terpadu olah aspirasi fasilitas sekolah dan sistem informasi pelaporan barang hilang/ditemukan yang dikelola secara transparan oleh Pengurus OSIS dan Dewan Guru Pembina.
            </p>

            <div className="text-xs font-mono text-white/60 space-y-1">
              <p>📍 {SITE_CONFIG.address}</p>
              <p>✉️ {SITE_CONFIG.email} · ☎️ {SITE_CONFIG.phone}</p>
            </div>
          </div>

          {/* Navigasi Layanan */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-posis-gold border-b border-posis-gold/30 pb-1.5">
              LAYANAN UTAMA
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/lost-found" className="hover:text-posis-gold transition-colors flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-posis-gold">01</span> Papan Lost &amp; Found
                </Link>
              </li>
              <li>
                <Link href="/aspirasi" className="hover:text-posis-gold transition-colors flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-posis-gold">02</span> Kotak Suara &amp; Aspirasi
                </Link>
              </li>
              <li>
                <Link href="/panduan-faq" className="hover:text-posis-gold transition-colors flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-posis-gold">03</span> Prosedur Klaim Barang
                </Link>
              </li>
              <li>
                <Link href="/panduan-faq" className="hover:text-posis-gold transition-colors flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-posis-gold">04</span> Kebijakan Privasi Anonim
                </Link>
              </li>
            </ul>
          </div>

          {/* Jam Operasional Titik Serah */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-posis-gold border-b border-posis-gold/30 pb-1.5">
              TITIK SERAH TERIMA FISIK
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              {SITE_CONFIG.handoverLocations.map((loc) => (
                <div key={loc.id} className="p-2 bg-white/5 border border-white/10 rounded-[2px]">
                  <p className="font-bold text-white">{loc.label}</p>
                  <p className="font-mono text-[11px] text-posis-gold/90">{loc.hours}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-white/60 gap-4">
          <p>© {new Date().getFullYear()} POSIS · SMK Negeri 1 Ciomas. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4">
            <span className="text-posis-gold">Disiplin · Kompeten · Berakhlak Mulia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
