import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { PreparednessChecklist } from '@/components/PreparednessChecklist'

export default async function EducationPage() {
  // Seed defaults if empty (safe for demo)
  const count = await prisma.article.count()
  if (count === 0) {
    await prisma.article.createMany({ data: [
      {
        title: 'Langkah Menghadapi Banjir',
        slug: 'langkah-menghadapi-banjir',
        excerpt: 'Persiapan sebelum, saat, dan setelah banjir untuk keselamatan keluarga.',
        content: 'Siapkan tas siaga, matikan listrik saat air naik, evakuasi ke tempat aman.',
      },
      {
        title: 'Setelah Banjir: Apa yang Harus Dilakukan',
        slug: 'setelah-banjir-apa-yang-harus-dilakukan',
        excerpt: 'Panduan pemulihan pasca banjir dengan aman dan higienis.',
        content: 'Bersihkan rumah dengan desinfektan, periksa instalasi listrik, lapor ke pihak berwenang.',
      },
      {
        title: 'Tips Pencegahan di Rumah',
        slug: 'tips-pencegahan-di-rumah',
        excerpt: 'Langkah pencegahan sederhana untuk mengurangi risiko banjir di rumah.',
        content: 'Perbaiki drainase, buat sumur resapan, simpan dokumen penting kedap air.',
      },
    ] })
  }

  const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Persiapan 
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Pelajari cara menghadapi bencana banjir dan siapkan diri Anda dengan baik.
        </p>
      </div>

      {/* Checklist Kesiapsiagaan */}
      <div className="w-full">
        <PreparednessChecklist />
      </div>

      {/* Artikel Edukasi */}
      
    </div>
  )
}



