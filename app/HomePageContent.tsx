"use client" // This remains a Client Component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, CloudRainWind, ShieldAlert } from 'lucide-react'
// REMOVE: import { fetchBMKGForecast } from '@/lib/fetchBMKG' - Data is now passed as a prop

// Define a type/interface for the data structure if possible
type ForecastItem = { riskLevel: 'high' | 'medium' | 'low'; /* other fields */ };

// Component is now a regular, synchronous function
export default function HomePageContent({ data }: { data: ForecastItem[] }) {
  const high = data.filter((d) => d.riskLevel === 'high').length
  const medium = data.filter((d) => d.riskLevel === 'medium').length
  const low = data.filter((d) => d.riskLevel === 'low').length

  return (
    <div className="space-y-10">
      {/* ... The rest of your existing JSX code ... */}
      <section className="text-center space-y-6">
        {/* ... (Motion components are fine here) ... */}
      </section>
      <section className="grid md:grid-cols-3 gap-4">
        {/* ... Card components using high, medium, low ... */}
      </section>
    </div>
  )
}