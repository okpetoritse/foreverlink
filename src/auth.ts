import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. Set up the high-speed Database Pool Connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// ==========================================
// 🚀 THE PRISMA SINGLETON (Fixes Ghost Connections)
// ==========================================
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// We initialize Prisma using your high-speed adapter, and cache it
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ==========================================
// 🔐 NEXTAUTH CONFIGURATION
// ==========================================
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // NextAuth v5 automatically finds AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET in your .env
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
});