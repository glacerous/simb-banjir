"use client"
import { useEffect, useRef } from 'react'

export type MapMarker = {
  id: string
  position: google.maps.LatLngLiteral
  title: string
  contentHtml: string
}

type Props = {
  center?: google.maps.LatLngLiteral
  zoom?: number
  markers?: MapMarker[]
}

export default function GoogleMap({ center = { lat: -2.5489, lng: 118.0149 }, zoom = 5, markers = [] }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const infoRef = useRef<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) return

    const init = async () => {
      // Load script once
      if (!document.querySelector('#gmaps-script')) {
        const s = document.createElement('script')
        s.id = 'gmaps-script'
        s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
        s.async = true
        document.body.appendChild(s)
        await new Promise((res) => {
          s.onload = () => res(null)
        })
      }

      const map = new google.maps.Map(ref.current as HTMLDivElement, { center, zoom, mapTypeControl: false })
      infoRef.current = new google.maps.InfoWindow()

      markers.forEach((m) => {
        const marker = new google.maps.Marker({ map, position: m.position, title: m.title })
        marker.addListener('click', () => {
          infoRef.current?.setContent(m.contentHtml)
          infoRef.current?.open({ map, anchor: marker })
        })
      })
    }

    init()
  }, [center, zoom, markers])

  return <div ref={ref} className="w-full h-[70vh] rounded-md border" />
}



