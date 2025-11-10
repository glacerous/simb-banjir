import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/requireAdmin'
import PanduanForm from '@/components/admin/PanduanForm'

export default async function AdminPanduanPage() {
  await requireAdmin()
  const page = await prisma.page.findUnique({ where: { slug: 'panduan' } })
  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Edit Panduan</h2>
      <PanduanForm page={page ?? undefined} />
    </div>
  )
}

