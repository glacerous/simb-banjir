import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/requireAdmin'

export default async function AdminHomePage() {
  await requireAdmin()

  const [totalArticles, latestArticle] = await Promise.all([
    prisma.article.count(),
    prisma.article.findFirst({ orderBy: { updatedAt: 'desc' } }),
  ])

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border p-6">
        <div className="text-sm text-gray-500">Total Articles</div>
        <div className="text-3xl font-bold">{totalArticles}</div>
      </div>

      <div className="rounded-lg border p-6 sm:col-span-2">
        <div className="text-sm text-gray-500">Latest Activity</div>
        <div className="mt-2">
          {latestArticle ? (
            <div>
              <div className="font-semibold">{latestArticle.title}</div>
              <div className="text-xs text-gray-500">Updated at {latestArticle.updatedAt.toISOString()}</div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No articles yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

