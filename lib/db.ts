// 1. Ganti import dari '@prisma/client' menjadi '@prisma/client/edge'
import { PrismaClient } from '@prisma/client/edge'

// 2. Import ekstensi Accelerate
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// 3. Tambahkan ekstensi Accelerate saat membuat instance baru.
// Kita tidak perlu menambahkannya jika instance sudah ada (global.prisma).
// Pastikan Anda memanggil .extends() setelah new PrismaClient().
export const prisma = global.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
