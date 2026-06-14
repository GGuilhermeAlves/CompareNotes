import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { mapNotebookRow, NOTEBOOK_GROUP_BY_SQL, NOTEBOOK_SELECT_SQL } from "@/lib/notebook-query"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const result = await pool.query(
      `
        ${NOTEBOOK_SELECT_SQL}
        WHERE n.id = $1
        ${NOTEBOOK_GROUP_BY_SQL}
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Notebook não encontrado" }, { status: 404 })
    }

    return NextResponse.json(mapNotebookRow(result.rows[0]))
  } catch (error) {
    console.error("Erro ao buscar notebook:", error)

    return NextResponse.json({ error: "Erro ao buscar notebook" }, { status: 500 })
  }
}
