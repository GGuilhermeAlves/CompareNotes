"use client"

import { useEffect, useState } from "react"

export default function Teste() {
  const [notebooks, setNotebooks] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/notebooks")
      .then((res) => res.json())
      .then((data) => setNotebooks(data))
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-5">Teste PostgreSQL</h1>

      {notebooks.map((nb) => (
        <div key={nb.id} className="border p-4 mb-4 rounded">
          <h2>{nb.nome}</h2>
          <p>{nb.marca}</p>
          <p>{nb.processador}</p>
        </div>
      ))}
    </div>
  )
}
