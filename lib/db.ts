import { Pool } from "pg"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não foi configurada no arquivo .env.local")
}

const isSupabase = process.env.DATABASE_URL.includes("supabase")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isSupabase || process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined
})

export default pool
