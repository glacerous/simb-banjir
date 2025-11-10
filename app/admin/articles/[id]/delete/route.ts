import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureAdmin } from '@/lib/session'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await ensureAdmin(request.headers)
  if (!admin.ok) {
    const status = admin.status === 401 ? 401 : 403
    const message = status === 401 ? 'Unauthorized' : 'Forbidden'
    return NextResponse.json({ error: message }, { status })
  }
  await prisma.article.delete({ where: { id: params.id } })
  return NextResponse.redirect(new URL('/admin/articles', request.url))
}

