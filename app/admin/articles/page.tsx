import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/requireAdmin'

export default async function AdminArticlesPage() {
  await requireAdmin()
  const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Articles</h2>
        <Link href="/admin/articles/new" className="px-3 py-2 rounded bg-gray-900 text-white text-sm">New Article</Link>
      </div>
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3 hidden sm:table-cell">Slug</th>
              <th className="text-left p-3">Updated</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-3">{a.title}</td>
                <td className="p-3 hidden sm:table-cell">{a.slug}</td>
                <td className="p-3">{a.updatedAt.toISOString()}</td>
                <td className="p-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/admin/articles/${a.id}/edit`} className="px-2 py-1 rounded border text-xs">Edit</Link>
                    <form action={`/admin/articles/${a.id}/delete`} method="post">
                      <button formAction={`/admin/articles/${a.id}/delete`} className="px-2 py-1 rounded border text-xs text-red-600">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

