import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureAdmin } from '@/lib/session'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await ensureAdmin(request.headers)
  if (!admin.ok) {
    const status = admin.status === 401 ? 401 : 403
    const message = status === 401 ? 'Unauthorized' : 'Forbidden'
    return NextResponse.json({ error: message }, { status })
  }

  const { id } = params
  const data = await request.json()
  const { title, slug, excerpt, content, imageUrl } = data

  const updated = await prisma.article.update({
    where: { id },
    data: { title, slug, excerpt, content, imageUrl },
  })

  return NextResponse.json(updated)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await ensureAdmin(request.headers)
  if (!admin.ok) {
    const status = admin.status === 401 ? 401 : 403
    const message = status === 401 ? 'Unauthorized' : 'Forbidden'
    return NextResponse.json({ error: message }, { status })
  }

  const { id } = params
  await prisma.article.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

