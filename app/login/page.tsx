"use client"

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setDebugInfo('')
    setLoading(true)

    try {
      console.log('Attempting login with:', { email, baseURL: window.location.origin })
      
      const result = await authClient.signIn.email({
        email,
        password,
      })

      console.log('Login result:', result)

      if (result.error) {
        setError(result.error.message || 'Gagal masuk. Periksa email dan password Anda.')
        setDebugInfo(`Error code: ${result.error.status || 'unknown'}`)
      } else {
        try {
          const profileRes = await fetch('/api/users/me', { 
            cache: 'no-store',
            credentials: 'include' // Important for cookies
          })
          
          console.log('Profile fetch status:', profileRes.status)
          
          if (profileRes.ok) {
            const profile = await profileRes.json()
            if (profile?.user?.role === 'ADMIN') {
              router.push('/admin')
              router.refresh()
              return
            }
          }
        } catch (profileError) {
          console.error('Failed to fetch profile', profileError)
          setDebugInfo('Profile fetch failed but login succeeded')
        }

        router.push('/')
        router.refresh()
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Terjadi kesalahan saat masuk.')
      
      // Enhanced error debugging
      if (err.message?.includes('fetch')) {
        setDebugInfo('Network error - check API endpoint and CORS settings')
      } else if (err.message?.includes('CORS')) {
        setDebugInfo('CORS error - check server configuration')
      } else {
        setDebugInfo(`Error type: ${err.name || 'Unknown'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
            Masuk ke Akun
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Masukkan email dan password Anda untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="space-y-2">
                <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-800 dark:text-red-300 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
                {debugInfo && (
                  <div className="p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 text-xs font-mono">
                    {debugInfo}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nama@example.com"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 font-medium py-2"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Belum punya akun?{' '}
            <Link href="/signup" className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium">
              Daftar sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}