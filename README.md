# Pusat Informasi Banjir Nasional

Aplikasi Next.js 14 (App Router) dengan TypeScript, Tailwind CSS, Prisma + PostgreSQL, komponen shadcn-like, lucide-react, framer-motion, Leaflet + OpenStreetMap (gratis), dan data BMKG.

## Menjalankan

1. Install deps: `pnpm install` (atau npm/yarn)
2. Buat `.env`:
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public" 
BMKG_FORECAST_URL="https://data.bmkg.go.id/DataMKG/MEWS/prakiraan-cuaca.json"

3. Prisma: `pnpm prisma:generate` lalu `pnpm prisma:migrate`
4. Dev: `pnpm dev` → http://localhost:3000

## Catatan
- Struktur JSON BMKG bisa berubah; lihat `lib/fetchBMKG.ts` untuk normalisasi.
- Komponen UI meniru shadcn/ui dengan Tailwind.