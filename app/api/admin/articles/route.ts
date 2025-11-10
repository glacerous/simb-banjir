import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureAdmin } from '@/lib/session'

export async function GET(request: NextRequest) {
  const admin = await ensureAdmin(request.headers)
  if (!admin.ok) {
    const status = admin.status === 401 ? 401 : 403
    const message = status === 401 ? 'Unauthorized' : 'Forbidden'
    return NextResponse.json({ error: message }, { status })
  }

  const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(articles)
}

export async function POST(request: NextRequest) {
  const admin = await ensureAdmin(request.headers)
  if (!admin.ok) {
    const status = admin.status === 401 ? 401 : 403
    const message = status === 401 ? 'Unauthorized' : 'Forbidden'
    return NextResponse.json({ error: message }, { status })
  }

  const data = await request.json()
  const { title, slug, excerpt, content, imageUrl } = data

  if (!title || !slug) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const created = await prisma.article.create({
    data: { title, slug, excerpt: excerpt || '', content: content || '', imageUrl: imageUrl || null },
  })

  return NextResponse.json(created, { status: 201 })
}

