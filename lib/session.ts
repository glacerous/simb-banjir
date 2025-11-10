import type { Role } from '@prisma/client'
import { auth } from './auth'
import { prisma } from './db'

type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>

type SessionResult = {
  session: SessionData | null
  user: { id: string; role: Role } | null
}

export async function getSessionAndUser(headers: Headers): Promise<SessionResult> {
  const session = await auth.api.getSession({ headers })

  if (!session?.user?.id) {
    return { session: null, user: null }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })

  return {
    session,
    user,
  }
}

export async function ensureAdmin(headers: Headers) {
  const { session, user } = await getSessionAndUser(headers)

  if (!session || !user) {
    return { ok: false as const, status: 401 as const }
  }

  if (user.role !== 'ADMIN') {
    return { ok: false as const, status: 403 as const }
  }

  return { ok: true as const, session, user }
}

