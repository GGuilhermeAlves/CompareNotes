import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { mapNotebookRow, NOTEBOOK_GROUP_BY_SQL, NOTEBOOK_SELECT_SQL } from "@/lib/notebook-query"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await pool.query(`
      ${NOTEBOOK_SELECT_SQL}
      ${NOTEBOOK_GROUP_BY_SQL}
      ORDER BY n.marca, n.modelo
    `)

    return NextResponse.json(result.rows.map(mapNotebookRow))
  } catch (error) {
    console.error("Erro ao buscar notebooks:", error)

    return NextResponse.json({ error: "Erro ao buscar notebooks" }, { status: 500 })
  }
}
