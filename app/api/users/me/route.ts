import { NextRequest, NextResponse } from 'next/server'
import { getSessionAndUser } from '@/lib/session'

export async function GET(request: NextRequest) {
  const { session, user } = await getSessionAndUser(request.headers)

  if (!session || !user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({ user })
}

