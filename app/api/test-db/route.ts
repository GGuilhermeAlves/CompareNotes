import { NextResponse } from "next/server"
import pool from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW() AS now")

    return NextResponse.json({
      success: true,
      now: result.rows[0].now
    })
  } catch (error) {
    console.error("Erro ao testar banco:", error)

    return NextResponse.json(
      {
        success: false,
        error: String(error)
      },
      { status: 500 }
    )
  }
}
