"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Page = {
  id: string
  slug: string
  title: string
  whatToDo: string
  notToDo: string
}

export default function PanduanForm({ page }: { page?: Page }) {
  const router = useRouter()
  const [title, setTitle] = useState(page?.title ?? 'Panduan: Apa yang Boleh dan Tidak Boleh Dilakukan')
  const [whatToDo, setWhatToDo] = useState(page?.whatToDo ?? '')
  const [notToDo, setNotToDo] = useState(page?.notToDo ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/panduan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, whatToDo, notToDo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      router.refresh()
    } catch (e: any) {
      setError(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm mb-1">What to Do (Boleh)</label>
        <textarea className="w-full border rounded px-3 py-2" rows={8} value={whatToDo} onChange={e => setWhatToDo(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm mb-1">Not to Do (Tidak Boleh)</label>
        <textarea className="w-full border rounded px-3 py-2" rows={8} value={notToDo} onChange={e => setNotToDo(e.target.value)} />
      </div>
      <div>
        <button disabled={saving} className="px-4 py-2 rounded bg-gray-900 text-white text-sm">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

