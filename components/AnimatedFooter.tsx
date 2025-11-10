// components/AnimatedFooter.tsx
"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Footer } from '@/components/footer'; // Import komponen Footer statis Anda

export function AnimatedFooter() {
  // Gunakan useInView hook dari react-intersection-observer
  const [ref, inView] = useInView({
    triggerOnce: true, // Animasi hanya berjalan sekali
    threshold: 0.1,    // Pemicu saat 10% dari footer terlihat
  });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      <Footer />
    </motion.div>
  );
}