"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Article = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string | null
}

export default function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter()
  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [imageUrl, setImageUrl] = useState<string | null>(article?.imageUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>('')

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setImageUrl(data.url)
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { title, slug, excerpt, content, imageUrl }
      const res = await fetch(article ? `/api/admin/articles/${article.id}` : '/api/admin/articles', {
        method: article ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      router.push('/admin/articles')
      router.refresh()
    } catch (e: any) {
      setError(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4"> {/* DIPERBAIKI */}
      {error && <div className="text-red-600 text-sm">{error}</div>} {/* DIPERBAIKI */}
      <div>
        <label className="block text-sm mb-1">Title</label> {/* DIPERBAIKI */}
        <input className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} required /> {/* DIPERBAIKI */}
      </div>
      <div>
        <label className="block text-sm mb-1">Slug</label> {/* DIPERBAIKI */}
        <input className="w-full border rounded px-3 py-2" value={slug} onChange={e => setSlug(e.target.value)} required /> {/* DIPERBAIKI */}
      </div>
      <div>
        <label className="block text-sm mb-1">Excerpt</label> {/* DIPERBAIKI */}
        <textarea className="w-full border rounded px-3 py-2" value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} /> {/* DIPERBAIKI */}
      </div>
      <div>
        <label className="block text-sm mb-1">Content</label> {/* DIPERBAIKI */}
        <textarea className="w-full border rounded px-3 py-2" value={content} onChange={e => setContent(e.target.value)} rows={8} /> {/* DIPERBAIKI */}
      </div>
      <div>
        <label className="block text-sm mb-1">Image</label> {/* DIPERBAIKI */}
        {imageUrl && <img src={imageUrl} alt="cover" className="h-24 mb-2 rounded border object-cover" />} {/* DIPERBAIKI */}
        <input type="file" accept="image/*" onChange={e => e.target.files && handleUpload(e.target.files[0])} /> {/* DIPERBAIKI */}
        {uploading && <div className="text-xs text-gray-500">Uploading...</div>} {/* DIPERBAIKI */}
      </div>
      <div className="flex gap-2"> {/* DIPERBAIKI */}
        <button disabled={saving} className="px-4 py-2 rounded bg-gray-900 text-white text-sm"> {/* DIPERBAIKI */}
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}