"use client"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix default marker icons path in Next.js/Leaflet
const fixLeafletIcons = () => {
  // @ts-ignore - accessing private property to override
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

export type LeafletMarker = {
  id: string
  position: { lat: number; lng: number }
  title: string
  contentHtml: string
  type?: 'risk' | 'shelter' | 'hospital' | 'aid' // Jenis marker untuk ikon kustom
  iconColor?: string // Warna ikon kustom
}

type Props = {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: LeafletMarker[]
}

// Helper function untuk membuat ikon kustom
const createCustomIcon = (color: string, iconText: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      <span style="
        transform: rotate(45deg);
        color: white;
        font-size: 16px;
        font-weight: bold;
      ">${iconText}</span>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  })
}

export default function LeafletMap({ center = { lat: -2.5489, lng: 118.0149 }, zoom = 5, markers = [] }: Props) {
  useEffect(() => { fixLeafletIcons() }, [])

  return (
    <MapContainer center={[center.lat, center.lng]} zoom={zoom} className="w-full h-[70vh] rounded-md border">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m) => {
        // Tentukan ikon berdasarkan tipe marker
        let icon: L.Icon | L.DivIcon | undefined = undefined
        
        if (m.type === 'shelter') {
          icon = createCustomIcon('#3B82F6', '🏠') // Biru untuk posko pengungsian
        } else if (m.type === 'hospital') {
          icon = createCustomIcon('#EF4444', '🏥') // Merah untuk rumah sakit
        } else if (m.type === 'aid') {
          icon = createCustomIcon('#10B981', '📦') // Hijau untuk posko bantuan
        } else if (m.iconColor) {
          // Ikon kustom dengan warna yang ditentukan
          const color = m.iconColor
          icon = createCustomIcon(color, '📍')
        }

        return (
          <Marker 
            key={m.id} 
            position={[m.position.lat, m.position.lng]} 
            title={m.title}
            icon={icon}
          >
            <Popup className="custom-popup">
              <div dangerouslySetInnerHTML={{ __html: m.contentHtml }} />
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}



