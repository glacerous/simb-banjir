import { NextRequest, NextResponse } from 'next/server'
import { createWriteStream } from 'fs'
import { mkdir, stat } from 'fs/promises'
import path from 'path'
import { ensureAdmin } from '@/lib/session'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const admin = await ensureAdmin(request.headers)
  if (!admin.ok) {
    const status = admin.status === 401 ? 401 : 403
    const message = status === 401 ? 'Unauthorized' : 'Forbidden'
    return NextResponse.json({ error: message }, { status })
  }

  const contentType = request.headers.get('content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  try {
    await stat(uploadsDir)
  } catch {
    await mkdir(uploadsDir, { recursive: true })
  }

  const ext = path.extname(file.name) || '.bin'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const filePath = path.join(uploadsDir, fileName)

  await new Promise<void>((resolve, reject) => {
    const ws = createWriteStream(filePath)
    ws.on('error', reject)
    ws.on('finish', () => resolve())
    ws.write(buffer)
    ws.end()
  })

  const publicUrl = `/uploads/${fileName}`
  return NextResponse.json({ url: publicUrl }, { status: 201 })
}

