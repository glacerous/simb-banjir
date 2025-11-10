import { prisma } from '@/lib/db'
import Image from 'next/image'

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) {
    return <div className="max-w-3xl mx-auto px-4 py-12">Artikel tidak ditemukan.</div>
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold">{article.title}</h1>
      {article.imageUrl ? (
        // Using plain img for simplicity; you can switch to next/image if domains configured
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.imageUrl} alt={article.title} className="w-full rounded border object-cover" />
      ) : null}
      <article className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400">{article.excerpt}</p>
        <div className="whitespace-pre-wrap">{article.content}</div>
      </article>
    </div>
  )
}

