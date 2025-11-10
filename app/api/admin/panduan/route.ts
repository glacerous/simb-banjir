import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensureAdmin } from '@/lib/session'

export async function POST(request: NextRequest) {
  const admin = await ensureAdmin(request.headers)
  if (!admin.ok) {
    const status = admin.status === 401 ? 401 : 403
    const message = status === 401 ? 'Unauthorized' : 'Forbidden'
    return NextResponse.json({ error: message }, { status })
  }
  const body = await request.json()
  const { title, whatToDo, notToDo } = body
  const page = await prisma.page.upsert({
    where: { slug: 'panduan' },
    update: { title, whatToDo, notToDo },
    create: { slug: 'panduan', title, whatToDo, notToDo },
  })
  return NextResponse.json(page)
}

