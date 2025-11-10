export type BMKGCityForecast = {
  id: string
  name: string
  latitude: number
  longitude: number
  weather: string
  temperatureC: number
  humidity: number
  riskLevel: 'low' | 'medium' | 'high'
}

// Temporary mock data generator
function generateMockData(): BMKGCityForecast[] {
  const cities = [
    { name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
    { name: 'Surabaya', lat: -7.2575, lon: 112.7521 },
    { name: 'Bandung', lat: -6.9175, lon: 107.6191 },
    { name: 'Medan', lat: 3.5952, lon: 98.6722 },
    { name: 'Semarang', lat: -6.9667, lon: 110.4167 },
    { name: 'Palembang', lat: -2.9761, lon: 104.7754 },
    { name: 'Makassar', lat: -5.1477, lon: 119.4327 },
    { name: 'Depok', lat: -6.4025, lon: 106.7942 },
    { name: 'Tangerang', lat: -6.1781, lon: 106.6297 },
    { name: 'Bekasi', lat: -6.2349, lon: 106.9896 },
  ]

  const weathers = [
    'Cerah',
    'Berawan',
    'Hujan Ringan',
    'Hujan Lebat',
    'Hujan Petir',
    'Kabut',
  ]

  return cities.map((city) => {
    const weather = weathers[Math.floor(Math.random() * weathers.length)]
    const temp = Math.floor(Math.random() * 10) + 24 // 24-34°C
    const humidity = Math.floor(Math.random() * 30) + 65 // 65-95%
    
    return {
      id: `${city.name}-${city.lat}-${city.lon}`,
      name: city.name,
      latitude: city.lat,
      longitude: city.lon,
      weather,
      temperatureC: temp,
      humidity,
      riskLevel: computeRiskLevel(weather, temp, humidity),
    }
  })
}

export async function fetchBMKGForecast(): Promise<BMKGCityForecast[]> {
  // TODO: Replace with actual BMKG API implementation
  // The new BMKG API requires specific adm4 codes for each kelurahan
  // Documentation: https://data.bmkg.go.id/prakiraan-cuaca/
  
  console.log('⚠️ Using mock data - BMKG API endpoint has changed')
  console.log('📚 New API docs: https://data.bmkg.go.id/prakiraan-cuaca/')
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return generateMockData()
}

export function computeRiskLevel(
  weather: string,
  temperatureC: number,
  humidity: number
): BMKGCityForecast['riskLevel'] {
  const w = weather.toLowerCase()
  const heavy = w.includes('hujan lebat') || w.includes('thunder') || w.includes('storm') || w.includes('hujan deras') || w.includes('petir')
  const moderate = w.includes('hujan') || w.includes('rain')
  if (heavy || (moderate && humidity >= 85)) return 'high'
  if (moderate || humidity >= 75) return 'medium'
  return 'low'
}