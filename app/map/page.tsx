import dynamicImport from 'next/dynamic'
import { fetchBMKGForecast } from '@/lib/fetchBMKG'
import { AlertOctagon, AlertTriangle, CloudRain, ShieldCheck, Zap, Calendar, MapPin } from 'lucide-react'

// Dynamic import untuk LeafletMap dengan SSR disabled (karena Leaflet memerlukan window)
const LeafletMap = dynamicImport(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] rounded-md border bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">Memuat peta...</p>
    </div>
  ),
}) 

// Atur agar halaman selalu dinamis (tidak di-cache)
export const dynamic = 'force-dynamic'

// Tambahkan timestamp data (asumsi data diambil saat ini)
const dataTimestamp = new Date().toLocaleString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
});


// Data mock infrastruktur kritis
const infrastructureData = [
  {
    id: 'infra-1',
    type: 'shelter' as const,
    name: 'Posko Pengungsian Kelurahan Menteng',
    address: 'Jl. Menteng Raya No. 15, Jakarta Pusat',
    capacity: '150 orang',
    status: 'Tersedia',
    position: { lat: -6.1944, lng: 106.8229 },
  },
  {
    id: 'infra-2',
    type: 'hospital' as const,
    name: 'RSUD Cengkareng',
    address: 'Jl. Bumi Raya No. 1, Jakarta Barat',
    capacity: '24/7',
    status: 'Operasional',
    position: { lat: -6.1500, lng: 106.7333 },
  },
  {
    id: 'infra-3',
    type: 'aid' as const,
    name: 'Posko Bantuan DKI Jakarta',
    address: 'Jl. Medan Merdeka Selatan No. 8-9, Jakarta Pusat',
    capacity: 'Bantuan Makanan & Obat',
    status: 'Aktif',
    position: { lat: -6.1751, lng: 106.8265 },
  },
  {
    id: 'infra-4',
    type: 'shelter' as const,
    name: 'Posko Pengungsian Kemang',
    address: 'Jl. Kemang Raya No. 5, Jakarta Selatan',
    capacity: '200 orang',
    status: 'Tersedia',
    position: { lat: -6.2608, lng: 106.8064 },
  },
  {
    id: 'infra-5',
    type: 'hospital' as const,
    name: 'RS Fatmawati',
    address: 'Jl. RS Fatmawati Cilandak, Jakarta Selatan',
    capacity: '24/7',
    status: 'Operasional',
    position: { lat: -6.2894, lng: 106.7949 },
  },
  {
    id: 'infra-6',
    type: 'aid' as const,
    name: 'Posko Bantuan BPBD DKI',
    address: 'Jl. Tanah Abang I No. 1, Jakarta Pusat',
    capacity: 'Bantuan Logistik',
    status: 'Aktif',
    position: { lat: -6.1944, lng: 106.8103 },
  },
]

export default async function MapPage() {
    const data = await fetchBMKGForecast().catch(() => [])

    // Marker untuk risiko banjir
    const riskMarkers = data
      .filter((d) => ['medium', 'high'].includes(d.riskLevel))
      .filter((d) => isFinite(d.latitude) && isFinite(d.longitude))
      .map((d) => {
        // Tentukan warna berdasarkan tingkat risiko
        const riskColor = d.riskLevel === 'high' ? '#EF4444' : '#F59E0B'
        const riskIcon = d.riskLevel === 'high' ? '🚨' : '⚠️'

        return {
          id: d.id,
          position: { lat: d.latitude, lng: d.longitude },
          title: `${d.name} - ${d.weather}`,
          type: 'risk' as const,
          iconColor: riskColor,
          contentHtml: `
            <div style="min-width:220px; font-family: sans-serif; padding: 8px;">
              <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="font-weight: bold; margin-bottom: 8px; color: #111827;">${d.name}</h3>
                <p style="margin: 4px 0; color: #4b5563; font-size: 14px;">
                  Cuaca: <strong>${d.weather}</strong><br/>
                  Suhu: <strong>${d.temperatureC}°C</strong> | Kelembapan: <strong>${d.humidity}%</strong>
                </p>
                <hr style="margin: 8px 0; border-top: 1px solid #e5e7eb;"/>
                <p style="margin: 4px 0; color: #111827;">
                  ${riskIcon} Risiko Banjir: <strong style="color: ${riskColor};">${d.riskLevel.toUpperCase()}</strong>
                </p>
              </div>
            </div>
          `,
        }
      })

    // Marker untuk infrastruktur kritis
    const infrastructureMarkers = infrastructureData.map((infra) => {
      const typeLabels = {
        shelter: 'Posko Pengungsian',
        hospital: 'Rumah Sakit',
        aid: 'Posko Bantuan',
      }

      const statusColors = {
        'Tersedia': '#10B981',
        'Operasional': '#EF4444',
        'Aktif': '#3B82F6',
      }

      return {
        id: infra.id,
        position: infra.position,
        title: infra.name,
        type: infra.type,
        contentHtml: `
          <div style="min-width:240px; font-family: sans-serif; padding: 8px;">
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="font-weight: bold; margin-bottom: 8px; color: #111827; font-size: 16px;">${infra.name}</h3>
              <p style="margin: 4px 0; color: #6b7280; font-size: 13px; font-weight: 500;">
                ${typeLabels[infra.type]}
              </p>
              <hr style="margin: 8px 0; border-top: 1px solid #e5e7eb;"/>
              <p style="margin: 4px 0; color: #4b5563; font-size: 14px;">
                <strong>Alamat:</strong><br/>
                <span style="color: #6b7280;">${infra.address}</span>
              </p>
              <p style="margin: 8px 0 4px 0; color: #4b5563; font-size: 14px;">
                <strong>Kapasitas/Status:</strong><br/>
                <span style="color: #6b7280;">${infra.capacity}</span>
              </p>
              <div style="margin-top: 8px; padding: 6px 10px; background: ${statusColors[infra.status as keyof typeof statusColors] || '#6b7280'}20; border-radius: 4px; display: inline-block;">
                <span style="color: ${statusColors[infra.status as keyof typeof statusColors] || '#6b7280'}; font-weight: 600; font-size: 12px;">
                  ${infra.status}
                </span>
              </div>
            </div>
          </div>
        `,
      }
    })

    // Gabungkan semua marker
    const markers = [...riskMarkers, ...infrastructureMarkers]
    
    // Perhitungan Statistik
    const highRiskCount = data.filter(d => d.riskLevel === 'high').length
    const mediumRiskCount = data.filter(d => d.riskLevel === 'medium').length
    const rainCount = data.filter(d => d.weather.toLowerCase().includes('hujan') || d.weather.toLowerCase().includes('petir')).length
    
    // Logika Rekomendasi Keseluruhan (NEW FEATURE)
    let recommendationText = "Situasi cenderung aman. Tetap pantau perkembangan cuaca lokal."
    let recommendationColor = "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
    let RecommendationIconComponent = ShieldCheck
    
    if (highRiskCount > 0) {
        recommendationText = `WASPADA TINGGI: ${highRiskCount} lokasi menghadapi risiko banjir. Siapkan rencana evakuasi.`
        recommendationColor = "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
        RecommendationIconComponent = AlertOctagon
    } else if (mediumRiskCount > 0) {
        recommendationText = "WASPADA: Beberapa wilayah berisiko banjir sedang. Hindari area dataran rendah."
        recommendationColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
        RecommendationIconComponent = AlertTriangle
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
                <AlertTriangle className="h-7 w-7 text-red-500"/> Peta Pemantauan Cuaca & Risiko
            </h1>
          
            {/* KOTAK REKOMENDASI/PERINGATAN */}
            <div className={`p-4 rounded-lg shadow-md font-semibold text-base ${recommendationColor}`}>
                <div className="flex items-center gap-3">
                    <RecommendationIconComponent className="h-6 w-6 flex-shrink-0" />
                    <span>{recommendationText}</span>
                </div>
            </div>
          
            {/* TIMESTAMP BAR */}
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-b pb-2">
                <p className="font-medium">
                    <Calendar className="inline h-4 w-4 mr-1 text-blue-500"/> Data Diperbarui: **{dataTimestamp}**
                </p>
                <p className="font-light italic text-xs">
                    Filter: Hanya menampilkan Risiko Sedang/Tinggi
                </p>
            </div>

            {/* STATISTIK RISIKO BAR (DIRAPIKAN) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800/80 p-5 rounded-xl shadow-inner">
                
                {/* Kolom Risiko Tinggi */}
                <div className="flex flex-col items-center p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm border border-red-200 dark:border-red-800/50">
                    <Zap className="h-6 w-6 text-red-600 mb-1"/>
                    <span className="text-2xl font-bold text-red-700 dark:text-red-400">{highRiskCount}</span>
                    <span className="text-xs uppercase font-medium mt-1 text-gray-600 dark:text-gray-300">Risiko Tinggi</span>
                </div>

                {/* Kolom Risiko Sedang */}
                <div className="flex flex-col items-center p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm border border-orange-200 dark:border-orange-800/50">
                    <AlertTriangle className="h-6 w-6 text-amber-500 mb-1"/>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{mediumRiskCount}</span>
                    <span className="text-xs uppercase font-medium mt-1 text-gray-600 dark:text-gray-300">Risiko Sedang</span>
                </div>
                
                {/* Kolom Berpotensi Hujan */}
                <div className="flex flex-col items-center p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm border border-blue-200 dark:border-blue-800/50">
                    <CloudRain className="h-6 w-6 text-blue-600 mb-1"/>
                    <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{rainCount}</span>
                    <span className="text-xs uppercase font-medium mt-1 text-gray-600 dark:text-gray-300">Berpotensi Hujan</span>
                </div>
                
                {/* Kolom Total Lokasi */}
                <div className="flex flex-col items-center p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700">
                    <MapPin className="h-6 w-6 text-gray-500 mb-1"/>
                    <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">{data.length}</span>
                    <span className="text-xs uppercase font-medium mt-1 text-gray-600 dark:text-gray-300">Total Lokasi</span>
                </div>
            </div>

            <LeafletMap markers={markers} />

            <div className="border-t pt-4 space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Data cuaca disediakan oleh BMKG (Mock Data) dan dianalisis untuk potensi risiko banjir (Sedang/Tinggi). Marker hanya ditampilkan untuk wilayah dengan risiko Sedang atau Tinggi.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-red-500"></span>
                  <span>Risiko Tinggi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-amber-500"></span>
                  <span>Risiko Sedang</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 text-lg">🏠</span>
                  <span>Posko Pengungsian</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-lg">🏥</span>
                  <span>Rumah Sakit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-lg">📦</span>
                  <span>Posko Bantuan</span>
                </div>
              </div>
            </div>
        </div>
    )
}