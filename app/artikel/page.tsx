import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ArticlesListingPage() {
  const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-3xl font-extrabold">Artikel</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((a) => (
          <Link key={a.id} href={`/artikel/${a.slug}`} className="group">
            <Card className="transition-transform group-hover:-translate-y-1 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{a.title}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{a.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{a.content}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

