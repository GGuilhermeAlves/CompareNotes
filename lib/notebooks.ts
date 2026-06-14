export async function getNotebooks() {
  const res = await fetch("/api/notebooks", {
    cache: "no-store"
  })

  if (!res.ok) {
    throw new Error("Erro ao buscar notebooks")
  }

  return res.json()
}
