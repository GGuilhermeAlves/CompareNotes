import { NotebookData } from "@/types/notebook"

export const NOTEBOOK_SELECT_SQL = `
  SELECT
    n.id,
    n.marca,
    n.modelo,
    n.codigo_modelo,
    n.peso,
    n.sistema_operacional,

    e.processador,
    e.gpu,
    e.ram,
    e.ram_tipo,
    e.ram_freq,
    e.armazenamento,
    e.armazenamento_tipo,

    d.largura,
    d.profundidade,
    d.espessura,

    t.tamanho,
    t.proporcao,
    t.resolucao,
    t.painel,
    t.frequencia,
    t.cores,
    t.brilho,

    te.layout AS teclado_layout,
    te.rgb AS teclado_rgb,
    te.num_teclas AS teclado_num_teclas,

    w.resolucao AS webcam_resolucao,
    w.infravermelho AS webcam_infravermelho,

    b.capacidade_wh AS bateria_capacidade_wh,

    f.potencia_w AS fonte_potencia_w,

    co.cor AS construcao_cor,
    co.material AS construcao_material,

    COALESCE(
      json_agg(
        json_build_object(
          'tipo', c.tipo,
          'quantidade', c.quantidade,
          'suporta_pd', c.suporta_pd,
          'suporta_dp', c.suporta_dp,
          'thunderbolt', c.thunderbolt
        )
        ORDER BY c.id
      ) FILTER (WHERE c.id IS NOT NULL),
      '[]'
    ) AS conectividade
  FROM notebook n
  LEFT JOIN especificacao e ON e.notebook_id = n.id
  LEFT JOIN dimensao d ON d.notebook_id = n.id
  LEFT JOIN tela t ON t.notebook_id = n.id
  LEFT JOIN conectividade c ON c.notebook_id = n.id
  LEFT JOIN teclado te ON te.notebook_id = n.id
  LEFT JOIN webcam w ON w.notebook_id = n.id
  LEFT JOIN bateria b ON b.notebook_id = n.id
  LEFT JOIN fonte f ON f.notebook_id = n.id
  LEFT JOIN construcao co ON co.notebook_id = n.id
`

export const NOTEBOOK_GROUP_BY_SQL = `
  GROUP BY
    n.id,
    n.marca,
    n.modelo,
    n.codigo_modelo,
    n.peso,
    n.sistema_operacional,
    e.processador,
    e.gpu,
    e.ram,
    e.ram_tipo,
    e.ram_freq,
    e.armazenamento,
    e.armazenamento_tipo,
    d.largura,
    d.profundidade,
    d.espessura,
    t.tamanho,
    t.proporcao,
    t.resolucao,
    t.painel,
    t.frequencia,
    t.cores,
    t.brilho,
    te.layout,
    te.rgb,
    te.num_teclas,
    w.resolucao,
    w.infravermelho,
    b.capacidade_wh,
    f.potencia_w,
    co.cor,
    co.material
`

function text(value: unknown, fallback = "Não cadastrado") {
  if (value === null || value === undefined || value === "") return fallback
  return String(value)
}

function number(value: unknown, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback
  const converted = Number(value)
  return Number.isNaN(converted) ? fallback : converted
}

function numberText(value: unknown, suffix: string, fallback = "Não cadastrado") {
  const converted = number(value, NaN)
  if (Number.isNaN(converted)) return fallback
  return `${converted.toLocaleString("pt-BR")}${suffix}`
}

type DbPort = {
  tipo: string | null
  quantidade: number | null
  suporta_pd: boolean | null
  suporta_dp: boolean | null
  thunderbolt: number | null
}

function mapPortFeatures(port: DbPort) {
  const features: string[] = []

  if (port.suporta_pd) features.push("PD")
  if (port.suporta_dp) features.push("DP")

  const thunderbolt = number(port.thunderbolt, 0)
  if (thunderbolt > 0) features.push(`TB${thunderbolt}`)

  return features
}

export function mapNotebookRow(row: any): NotebookData {
  const conectividade: DbPort[] = Array.isArray(row.conectividade)
    ? row.conectividade
    : []

  const tecladoInfo = [
    text(row.teclado_layout),
    row.teclado_rgb ? "RGB" : null,
    text(row.teclado_num_teclas)
  ].filter((item) => item && item !== "Não cadastrado")

  const construcaoInfo = [
    text(row.construcao_cor),
    text(row.construcao_material)
  ].filter((item) => item && item !== "Não cadastrado")

  return {
    id: number(row.id),
    nome: text(row.modelo || row.codigo_modelo, "Notebook sem modelo"),
    marca: text(row.marca),
    imagem: "/notebook-placeholder.svg",
    specs: {
      processador: text(row.processador),
      placaDeVideo: text(row.gpu),
      ram: {
        capacidade: numberText(row.ram, " GB"),
        tipo: text(row.ram_tipo),
        frequencia: numberText(row.ram_freq, "MT/s")
      },
      armazenamento: {
        capacidade: numberText(row.armazenamento, " GB"),
        tipo: text(row.armazenamento_tipo)
      },
      tela: {
        tamanho: text(row.tamanho),
        painel: text(row.painel),
        resolucao: text(row.resolucao),
        frequencia: numberText(row.frequencia, "Hz"),
        cores: text(row.cores),
        brilho: numberText(row.brilho, " nits")
      },
      conectividade: conectividade.map((port) => ({
        qtd: number(port.quantidade, 1),
        tipo: text(port.tipo, "Porta"),
        features: mapPortFeatures(port)
      })),
      teclado: tecladoInfo.length > 0 ? tecladoInfo.join(" | ") : "Não cadastrado",
      webcam: row.webcam_infravermelho
        ? `${text(row.webcam_resolucao)} | IR`
        : text(row.webcam_resolucao),
      bateria: numberText(row.bateria_capacidade_wh, "Wh"),
      fonte: numberText(row.fonte_potencia_w, "W"),
      so: text(row.sistema_operacional),
      peso: numberText(row.peso, " kg"),
      construcao:
        construcaoInfo.length > 0 ? construcaoInfo.join(" | ") : "Não cadastrado"
    },
    dimensoes: {
      largura: number(row.largura),
      profundidade: number(row.profundidade),
      espessura: number(row.espessura)
    }
  }
}