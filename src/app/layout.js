import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata = {
  title: 'POSIS — Pusat Olah Suara & Informasi Siswa | SMK Negeri 1 Ciomas',
  description:
    'POSIS (Pusat Olah Suara & Informasi Siswa) adalah portal resmi SMK Negeri 1 Ciomas, Kabupaten Bogor untuk Lost & Found dan Kotak Saran/Aspirasi Siswa.',
  icons: {
    icon: '/assets/logo-smkn1-ciomas.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&family=Geist:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-posis-bone text-posis-ink font-sans antialiased selection:bg-posis-gold selection:text-posis-ink">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

