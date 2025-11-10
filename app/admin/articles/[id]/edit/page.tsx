import { prisma } from '@/lib/db'
import ArticleForm from '@/components/admin/ArticleForm'
import { requireAdmin } from '@/lib/requireAdmin'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const article = await prisma.article.findUnique({ where: { id: params.id } })
  if (!article) {
    return <div>Not found</div>
  }
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Edit Article</h2>
      <ArticleForm article={article} />
    </div>
  )
}

