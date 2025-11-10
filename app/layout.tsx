// app/layout.tsx (Pastikan tidak ada padding di <main>)

import './globals.css';
import { Navbar } from '@/components/navbar'; 
import LocalFont from 'next/font/local'

// Definisikan Font Lokal Flink Sans Anda
const flinkSans = LocalFont({
  src: [
    {
      path: '../public/fonts/Fontspring-DEMO-flink-regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Fontspring-DEMO-flink-bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Fontspring-DEMO-flink-medium.otf',
      weight: '500',
      style: 'normal',
    },
    // {
    //   path: '../public/fonts/Fontspring-DEMO-flink-extrabold.otf',
    //   weight: '800', // Sesuaikan dengan berat Extrabold
    //   style: 'normal',
    // },
  ],
  variable: '--font-flink', // Nama variabel CSS yang lebih deskriptif
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="min-h-screen relative">
          <Navbar />
          {/* Gunakan padding top berdasarkan tinggi navbar agar konten tidak tertutup */}
          <main className="relative z-10 pt-[var(--nav-h)]"> 
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}