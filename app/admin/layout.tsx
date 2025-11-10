import { ReactNode } from 'react'
import Link from 'next/link'
import { requireAdmin } from '@/lib/requireAdmin'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/articles">Articles</Link>
          <Link href="/admin/panduan">Panduan</Link>
        </nav>
      </div>
      {children}
    </div>
  )
}

