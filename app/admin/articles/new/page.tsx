import ArticleForm from '@/components/admin/ArticleForm'
import { requireAdmin } from '@/lib/requireAdmin'

export default async function NewArticlePage() {
  await requireAdmin()
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">New Article</h2>
      <ArticleForm />
    </div>
  )
}

