import { prisma } from '@/lib/db'

export default async function PanduanPage() {
  // Ensure page exists
  const existing = await prisma.page.findUnique({ where: { slug: 'panduan' } })
  const page = existing ?? (await prisma.page.create({
    data: {
      slug: 'panduan',
      title: 'Panduan: Apa yang Boleh dan Tidak Boleh Dilakukan',
      whatToDo: 'Isi bagian ini dengan hal-hal yang Boleh dilakukan.',
      notToDo: 'Isi bagian ini dengan hal-hal yang Tidak Boleh dilakukan.',
    },
  }))

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-extrabold">{page.title}</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">What to Do (Apa yang Boleh Dilakukan)</h2>
          <div className="prose dark:prose-invert whitespace-pre-wrap">{page.whatToDo}</div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Not to Do (Apa yang Tidak Boleh Dilakukan)</h2>
          <div className="prose dark:prose-invert whitespace-pre-wrap">{page.notToDo}</div>
        </section>
      </div>
    </div>
  )
}

