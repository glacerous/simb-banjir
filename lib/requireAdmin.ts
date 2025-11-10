import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ensureAdmin } from './session'

export async function requireAdmin() {
  const result = await ensureAdmin(headers())

  if (!result.ok) {
    if (result.status === 401) {
      redirect('/login')
    }
    redirect('/')
  }

  if (!result.session?.user?.id) {
    redirect('/login')
  }

  return result
}


