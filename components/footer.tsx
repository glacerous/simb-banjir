// components/ui/footer.tsx
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Footer container. Gunakan padding-y yang cukup.
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 relative z-10">
      <div className="max-w-6xl mx-auto px-4 text-sm text-gray-600 dark:text-gray-400">
        
        {/* Baris Utama: Copyright dan Sumber Data */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-3 md:space-y-0">
          
          {/* Info Copyright dan Proyek */}
          <p className="text-center md:text-left">
            &copy; {currentYear} **Pusat Informasi Banjir Nasional**. Dibuat untuk tujuan edukasi.
          </p>
          
          {/* Link Sumber Data */}
          <div className="flex space-x-4">
            <Link 
              href="https://www.bmkg.go.id/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Sumber Data: BMKG ↗
            </Link>
            <Link 
              href="/about" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Tentang Kami
            </Link>
            {/* Tambahkan link ke halaman status yang baru dibuat */}
            
          </div>
        </div>

        {/* Garis pemisah opsional untuk elemen yang lebih detail */}
        {/* <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600"> 
          <p className="text-xs text-center">Slogan atau informasi tambahan.</p>
        </div> */}

      </div>
    </footer>
  );
}