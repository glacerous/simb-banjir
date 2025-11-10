// lib/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL || 
    process.env.NEXT_PUBLIC_APP_URL || 
    "http://localhost:3000",
  basePath: "/api/auth",
  // Add trusted origins to prevent CORS issues
  trustedOrigins: [
    "http://localhost:3000",
    "https://simb-banjir-ccqn.vercel.app",
  ],
})