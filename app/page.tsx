"use client"
import { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ColorBends from './ColorBends'
import { ArrowDown, Zap, AlertTriangle, MapPin, BookOpen, ChevronDown } from 'lucide-react'

// Komponen Button sederhana dengan types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'default' | 'outline' | 'link' | 'ghost'  // Add 'ghost' here
  size?: 'default' | 'lg' | 'sm'
}

const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-100',
    link: 'text-blue-600 underline-offset-4 hover:underline',
    ghost: ''  // Add ghost variant with empty string so className can override
  }

  const sizes = {
    default: 'h-10 px-4 py-2',
    lg: 'h-12 px-8 text-lg',
    sm: 'h-8 px-3 text-sm'
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Komponen Footer
const AnimatedFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Kolom 1 */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Siaga Banjir
            </h3>
            <p className="text-gray-400 text-sm">
              Platform informasi dan peringatan dini bencana banjir untuk meningkatkan kesiapsiagaan masyarakat.
            </p>
          </div>
          
          {/* Kolom 2 */}
          <div>
            <h4 className="font-semibold mb-4">Menu Utama</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/map" className="hover:text-white transition-colors">Peta Banjir</a></li>
              <li><a href="/education" className="hover:text-white transition-colors">Kesiapsiagaan</a></li>
              <li><a href="/weather" className="hover:text-white transition-colors">Prediksi Cuaca</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">Tentang Kami</a></li>
            </ul>
          </div>
          
          {/* Kolom 3 */}
          <div>
            <h4 className="font-semibold mb-4">Kontak Darurat</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>BNPB: 117</li>
              <li>BPBD: (0274) 555-123</li>
              <li>Damkar: 113</li>
              <li>SAR: 115</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Siaga Banjir. Dibuat untuk keselamatan bersama.</p>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  const [showFooter, setShowFooter] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = document.documentElement.scrollTop
      const clientHeight = document.documentElement.clientHeight
      
      // Footer muncul ketika user scroll hampir ke bawah (90% dari total scroll)
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
      setShowFooter(scrollPercentage > 0.85)
      
      // Sembunyikan scroll indicator setelah user mulai scroll
      if (scrollTop > 100) {
        setShowScrollIndicator(false)
      } else {
        setShowScrollIndicator(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative">
      {/* Hero Section */}
      <section 
        className="relative min-h-[120vh] flex flex-col justify-start items-center text-center px-8 py-20 pt-10 overflow-hidden"
      >
        {/* ColorBends background */}
        <div className="absolute inset-0 -z-10">
        <ColorBends
  colors={["#0047AB", "#00BFFF", "#3CB371", "#DA70D6", "#0047AB", "#00BFFF", "#3CB371", "#DA70D6"]}
  rotation={60}
  speed={0.3}
  scale={2.6}
  frequency={1.8} //1.6 original
  warpStrength={1.0}
  mouseInfluence={0.8}
  parallax={0.6}
  noise={0.3}
  transparent
/>
        </div>

        {/* Overlays to ensure readability on both themes */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-white/35 dark:bg-black/40" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/30 via-transparent to-white/50 dark:from-black/40 dark:via-transparent dark:to-black/70" />
        
        <div className="h-6"></div>
        <div className="h-6"></div>
        <div className="h-6"></div>

        {/* Konten Hero */}
        <div className="relative z-20 max-w-4xl text-gray-900 dark:text-gray-100">
          {/* Badge Peringatan */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-gray-800 dark:text-gray-100 text-sm font-medium shadow-lg border border-gray-200/70 dark:border-white/10"
          >
            <Zap className="h-4 w-4 text-orange-500"/> 
            Peringatan Dini Bencana
          </motion.div>

          {/* Judul Utama - Menggunakan font-medium untuk Flink */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-6xl md:text-7xl lg:text-8xl tracking-tight text-gray-900 dark:text-white mb-6"
            style={{ fontFamily: 'var(--font-flink)', fontWeight: 500 }}
          >
            Siaga bencana banjir.
          </motion.h1>

          {/* Sub-judul */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: 'var(--font-flink)', fontWeight: 400 }}
          >
            Informasi banjir terkini, prediksi cuaca BMKG, dan panduan kesiapsiagaan di satu tempat.
          </motion.p>

          {/* Tombol Aksi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
    size="lg"
    // Use an empty or ghost variant to prevent default color injection
    variant="ghost" 
    
    // Now these classes will work without conflict:
    className="rounded-full px-8 py-4 
               bg-white text-gray-900 hover:bg-gray-100 
               shadow-2xl border-none 
               dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
    style={{ fontFamily: 'var(--font-flink)', fontWeight: 500 }}
>
<a href="/map">
    Lihat Peta Sekarang
    <span className="ml-2">→</span>
  </a>
</Button>
            <Button 
              variant="link" 
              size="lg" 
              className="text-gray-900 hover:text-gray-700 underline-offset-4 dark:text-gray-100 dark:hover:text-gray-300"
              style={{ fontFamily: 'var(--font-flink)', fontWeight: 400 }}
            >
              <a href="/education">
    Persiapan
  </a>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
              <p className="text-gray-800 text-xs font-medium tracking-widest uppercase" style={{ fontFamily: 'var(--font-flink)' }}>
                SCROLL ↓
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer - Muncul ketika scroll ke bawah */}
      <AnimatePresence>
        {showFooter && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <AnimatedFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}