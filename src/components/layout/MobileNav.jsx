'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MessageSquare, HelpCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function MobileNav() {
  const { isAdmin } = useAuth();
  const pathname = usePathname() || '/';

  const navItems = [
    { name: 'Beranda', path: '/beranda', icon: Home },
    { name: 'Lost & Found', path: '/lost-found', icon: Search },
    { name: 'Aspirasi', path: '/aspirasi', icon: MessageSquare },
    { name: 'Panduan', path: '/panduan-faq', icon: HelpCircle },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin', path: '/admin/dashboard', icon: ShieldCheck });
  }

  const gridColsClass = isAdmin ? 'grid-cols-5' : 'grid-cols-4';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-posis-bone border-t-2 border-posis-blue shadow-[0_-4px_12px_rgba(31,63,148,0.08)]">
      <div className={`grid ${gridColsClass} items-center justify-around h-16`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isActive
                  ? 'text-posis-blue bg-posis-blue/10 font-bold border-t-2 border-posis-blue -mt-[2px]'
                  : 'text-stone-600 hover:text-posis-blue'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5 stroke-[2]" />
              <span className="text-[10px] font-mono tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
