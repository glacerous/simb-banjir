"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { CheckCircle2, Circle } from 'lucide-react'

interface ChecklistItem {
  key: string
  label: string
  category: string
}

const checklistItems: ChecklistItem[] = [
  { key: 'makanan-3-hari', label: 'Makanan siap saji untuk 3 hari', category: 'Makanan & Minuman' },
  { key: 'air-minum', label: 'Air minum (minimal 3 liter per orang per hari)', category: 'Makanan & Minuman' },
  { key: 'obat-obatan', label: 'Obat-obatan pribadi dan P3K', category: 'Kesehatan' },
  { key: 'dokumen-penting', label: 'Dokumen penting (KTP, KK, sertifikat) dalam wadah kedap air', category: 'Dokumen' },
  { key: 'pakaian', label: 'Pakaian ganti dan selimut', category: 'Pakaian' },
  { key: 'alat-komunikasi', label: 'Radio/Handphone dengan charger powerbank', category: 'Elektronik' },
  { key: 'senter', label: 'Senter dan baterai cadangan', category: 'Elektronik' },
  { key: 'uang-tunai', label: 'Uang tunai secukupnya', category: 'Keuangan' },
  { key: 'perlengkapan-bayi', label: 'Perlengkapan bayi (jika ada)', category: 'Keluarga' },
  { key: 'tas-siaga', label: 'Tas siaga bencana siap pakai', category: 'Persiapan' },
]

interface PreparednessChecklistProps {
  userId?: string
}

export function PreparednessChecklist({ userId }: PreparednessChecklistProps) {
  const { data: session } = authClient.useSession()
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load saved checklist items from database
  useEffect(() => {
    const loadChecklist = async () => {
      if (!session?.user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/checklist?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          // --- FIX APPLIED HERE ---
                    const completedKeys: string[] = data
                      .filter((item: any) => item.isCompleted)
                      .map((item: any) => String(item.itemKey)); // 1. Map itemKey to guaranteed String
          
                    // 2. Explicitly type the Set creation
                    const completedItems: Set<string> = new Set(completedKeys);
                    
                    setCheckedItems(completedItems); // Now TypeScript accepts Set<string>
                    // --------------------------
        }
      } catch (error) {
        console.error('Error loading checklist:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChecklist()
  }, [session?.user?.id])

  // Save checklist item to database
  const toggleItem = async (itemKey: string) => {
    if (!session?.user?.id) {
      // If not logged in, just update local state (won't persist)
      setCheckedItems((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(itemKey)) {
          newSet.delete(itemKey)
        } else {
          newSet.add(itemKey)
        }
        return newSet
      })
      return
    }

    const isChecked = checkedItems.has(itemKey)
    setSaving(true)

    try {
      const response = await fetch('/api/checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemKey,
          isCompleted: !isChecked,
        }),
      })

      if (response.ok) {
        setCheckedItems((prev) => {
          const newSet = new Set(prev)
          if (isChecked) {
            newSet.delete(itemKey)
          } else {
            newSet.add(itemKey)
          }
          return newSet
        })
      } else {
        console.error('Error saving checklist item')
      }
    } catch (error) {
      console.error('Error saving checklist item:', error)
    } finally {
      setSaving(false)
    }
  }

  // Group items by category
  const itemsByCategory = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  const totalItems = checklistItems.length
  const completedCount = checkedItems.size
  const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

  if (loading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <p className="text-gray-500 dark:text-gray-400">Memuat checklist...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Checklist Tas Siaga Bencana
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {session?.user ? (
            <>Centang item yang sudah Anda siapkan. Progress akan tersimpan otomatis.</>
          ) : (
            <>
              <span className="text-orange-500 font-medium">Login</span> untuk menyimpan progress checklist Anda.
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Progress: {completedCount} / {totalItems} item
            </span>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Checklist Items by Category */}
        <div className="space-y-6">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((item) => {
                  const isChecked = checkedItems.has(item.key)
                  return (
                    <label
                      key={item.key}
                      className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleItem(item.key)}
                        disabled={saving}
                        className="sr-only"
                      />
                      {isChecked ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      )}
                      <span
                        className={`flex-1 text-sm ${
                          isChecked
                            ? 'text-gray-600 dark:text-gray-300 line-through'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {!session?.user && (
          <div className="p-4 rounded-md bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-orange-800 dark:text-orange-300">
              💡 <strong>Tips:</strong> Login untuk menyimpan progress checklist Anda dan akses dari perangkat manapun.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

