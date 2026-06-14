import React, { useState, useMemo } from "react"
import { Search, Filter, X, SlidersHorizontal, Plus, Monitor, Link, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { NotebookData, PortRule } from "@/types/notebook"

function FilterSection({ title, options, selected, onChange, renderLabel }: any) {
  if (options.length === 0) return null
  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
        {options.map((opt: string) => {
          const isSelected = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isSelected
                  ? "bg-blue-500/20 border border-blue-500/30 text-blue-100 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                  : "bg-black/40 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {renderLabel ? renderLabel(opt) : opt}
              {isSelected && <X className="w-3 h-3 opacity-70" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function NotebookSelectorModal({
  selectedId,
  onChange,
  color,
  label,
  notebooks
}: {
  selectedId: number
  onChange: (id: number) => void
  color: string
  label: string
  notebooks: NotebookData[]
}) {
  const [open, setOpen] = useState(false)
  const selectedNb = notebooks.find((n) => n.id === selectedId) || notebooks[0]

  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    marca: [] as string[],
    processador: [] as string[],
    placaDeVideo: [] as string[],
    ram: [] as string[],
    armazenamento: [] as string[],
    tamanhoTela: [] as string[],
    resolucaoTela: [] as string[],
    freqTela: [] as string[],
    painelTela: [] as string[],
    portRules: [] as PortRule[]
  })

  const [draftRule, setDraftRule] = useState<{ qtd: number; baseType: string; features: string[] }>({
    qtd: 1,
    baseType: "USB-C",
    features: []
  })

  const toggleFilter = (type: keyof typeof filters, value: string) => {
    if (type === "portRules") return
    setFilters((prev) => {
      const current = prev[type] as string[]
      return {
        ...prev,
        [type]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
      }
    })
  }

  const handleAddDraftRule = () => {
    const newRule: PortRule = {
      id: Date.now().toString(),
      baseType: draftRule.baseType,
      minQtd: draftRule.qtd,
      features: draftRule.features
    }
    setFilters((prev) => ({ ...prev, portRules: [...prev.portRules, newRule] }))
    setDraftRule({ qtd: 1, baseType: "USB-C", features: [] })
  }

  const removePortRule = (id: string) => {
    setFilters((prev) => ({ ...prev, portRules: prev.portRules.filter((r) => r.id !== id) }))
  }

  const toggleDraftFeature = (feat: string) => {
    setDraftRule((prev) => ({
      ...prev,
      features: prev.features.includes(feat) ? prev.features.filter((f) => f !== feat) : [...prev.features, feat]
    }))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      marca: [],
      processador: [],
      placaDeVideo: [],
      ram: [],
      armazenamento: [],
      tamanhoTela: [],
      resolucaoTela: [],
      freqTela: [],
      painelTela: [],
      portRules: []
    })
  }

  const filterOptions = useMemo(() => {
    return {
      marcas: Array.from(new Set(notebooks.map((n) => n.marca))),
      processadores: Array.from(new Set(notebooks.map((n) => n.specs.processador))),
      gpus: Array.from(new Set(notebooks.map((n) => n.specs.placaDeVideo))),
      ram: Array.from(new Set(notebooks.map((n) => n.specs.ram.capacidade))),
      armazenamento: Array.from(new Set(notebooks.map((n) => n.specs.armazenamento.capacidade))),
      tamanhos: Array.from(new Set(notebooks.map((n) => n.specs.tela.tamanho))),
      resolucoes: Array.from(new Set(notebooks.map((n) => n.specs.tela.resolucao))),
      frequencias: Array.from(new Set(notebooks.map((n) => n.specs.tela.frequencia))),
      paineis: Array.from(new Set(notebooks.map((n) => n.specs.tela.painel))),
      features: Array.from(new Set(notebooks.flatMap((n) => n.specs.conectividade.flatMap((p) => p.features))))
    }
  }, [notebooks])

  const filteredNotebooks = useMemo(() => {
    return notebooks.filter((nb) => {
      const matchSearch =
        nb.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nb.marca.toLowerCase().includes(searchTerm.toLowerCase())
      const matchMarca = filters.marca.length === 0 || filters.marca.includes(nb.marca)
      const matchProc = filters.processador.length === 0 || filters.processador.includes(nb.specs.processador)
      const matchGpu = filters.placaDeVideo.length === 0 || filters.placaDeVideo.includes(nb.specs.placaDeVideo)
      const matchRam = filters.ram.length === 0 || filters.ram.includes(nb.specs.ram.capacidade)
      const matchArmaz =
        filters.armazenamento.length === 0 || filters.armazenamento.includes(nb.specs.armazenamento.capacidade)
      const matchTamTela = filters.tamanhoTela.length === 0 || filters.tamanhoTela.includes(nb.specs.tela.tamanho)
      const matchResTela = filters.resolucaoTela.length === 0 || filters.resolucaoTela.includes(nb.specs.tela.resolucao)
      const matchFreqTela = filters.freqTela.length === 0 || filters.freqTela.includes(nb.specs.tela.frequencia)
      const matchPainelTela = filters.painelTela.length === 0 || filters.painelTela.includes(nb.specs.tela.painel)

      const matchPortRules = filters.portRules.every((rule) => {
        const matchingPorts = nb.specs.conectividade.filter((p) => {
          const isRightType = rule.baseType === "Qualquer" || p.tipo.toLowerCase().includes(rule.baseType.toLowerCase())
          const hasAllFeatures = rule.features.every((f) => p.features.includes(f))
          return isRightType && hasAllFeatures
        })
        const totalMatchingQtd = matchingPorts.reduce((sum, p) => sum + p.qtd, 0)
        return totalMatchingQtd >= rule.minQtd
      })

      return (
        matchSearch &&
        matchMarca &&
        matchProc &&
        matchGpu &&
        matchRam &&
        matchArmaz &&
        matchTamTela &&
        matchResTela &&
        matchFreqTela &&
        matchPainelTela &&
        matchPortRules
      )
    })
  }, [searchTerm, filters, notebooks])

  const activeFilterCount = Object.values(filters).reduce((acc, curr) => acc + curr.length, 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="w-full text-left outline-none relative bg-black/40 backdrop-blur-2xl rounded-2xl flex overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all hover:bg-white/10 hover:border-white/20 group cursor-pointer min-h-[76px]"
          >
            <div
              className="w-1.5 h-full absolute left-0 top-0 transition-all"
              style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
            ></div>
            <div className="p-4 pl-6 w-full flex justify-between items-center">
              <div className="flex flex-col gap-1 w-full text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{label}</span>
                  <SlidersHorizontal className="w-4 h-4 text-zinc-500 transition-transform group-hover:text-white" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight leading-none mt-1 text-left w-full">
                  {selectedNb.marca} {selectedNb.nome}
                </h3>
                <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-2 pr-2 border-t border-white/5 pt-2">
                  <span>
                    {Math.round(selectedNb.dimensoes.largura * 10)}×{Math.round(selectedNb.dimensoes.profundidade * 10)}
                    ×{Math.round(selectedNb.dimensoes.espessura * 10)} mm
                  </span>
                  <span className="text-zinc-300">{selectedNb.specs.peso}</span>
                </div>
              </div>
            </div>
          </button>
        }
      />

      <DialogContent className="bg-[#09090b]/95 backdrop-blur-3xl border border-white/10 text-white rounded-[24px] shadow-[0_0_100px_rgba(0,0,0,0.8)] sm:rounded-[32px] p-0 overflow-hidden flex flex-col w-[95vw] sm:max-w-[1400px] h-[85vh] lg:h-[90vh]">
        <DialogHeader className="px-6 py-5 border-b border-white/5 bg-white/[0.02] shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">Pesquisar Notebook</DialogTitle>
              <DialogDescription className="text-zinc-400 text-sm">
                Utilize os filtros abaixo para encontrar a especificação exata que precisa.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          <div className="w-full md:w-[360px] bg-black/20 border-r border-white/5 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between -mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filtros
                {activeFilterCount > 0 && (
                  <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </h3>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[11px] text-zinc-400 hover:text-white transition-colors"
                >
                  Limpar tudo
                </button>
              )}
            </div>

            <FilterSection
              title="Marcas"
              options={filterOptions.marcas}
              selected={filters.marca}
              onChange={(v: string) => toggleFilter("marca", v)}
            />
            <FilterSection
              title="Processador"
              options={filterOptions.processadores}
              selected={filters.processador}
              onChange={(v: string) => toggleFilter("processador", v)}
            />
            <FilterSection
              title="Placa de Vídeo"
              options={filterOptions.gpus}
              selected={filters.placaDeVideo}
              onChange={(v: string) => toggleFilter("placaDeVideo", v)}
            />
            <FilterSection
              title="Memória RAM"
              options={filterOptions.ram}
              selected={filters.ram}
              onChange={(v: string) => toggleFilter("ram", v)}
            />
            <FilterSection
              title="Armazenamento"
              options={filterOptions.armazenamento}
              selected={filters.armazenamento}
              onChange={(v: string) => toggleFilter("armazenamento", v)}
            />

            <div className="space-y-6 pt-4 border-t border-white/5">
              <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Monitor className="w-3 h-3" /> Especificações de Tela
              </h4>
              <FilterSection
                title="Tamanho"
                options={filterOptions.tamanhos}
                selected={filters.tamanhoTela}
                onChange={(v: string) => toggleFilter("tamanhoTela", v)}
              />
              <FilterSection
                title="Resolução"
                options={filterOptions.resolucoes}
                selected={filters.resolucaoTela}
                onChange={(v: string) => toggleFilter("resolucaoTela", v)}
              />
              <FilterSection
                title="Frequência"
                options={filterOptions.frequencias}
                selected={filters.freqTela}
                onChange={(v: string) => toggleFilter("freqTela", v)}
              />
              <FilterSection
                title="Painel"
                options={filterOptions.paineis}
                selected={filters.painelTela}
                onChange={(v: string) => toggleFilter("painelTela", v)}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                <Link className="w-3 h-3" /> Requisitos de Conexão
              </h4>
              {filters.portRules.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.portRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-[11px] text-blue-100 font-medium"
                    >
                      <span>
                        <strong className="text-blue-400">{rule.minQtd}x</strong> {rule.baseType}
                      </span>
                      {rule.features.length > 0 && (
                        <span className="text-blue-300/70">c/ {rule.features.join(", ")}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removePortRule(rule.id)}
                        className="ml-1 text-blue-400/50 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={draftRule.qtd}
                    onChange={(e) => setDraftRule((prev) => ({ ...prev, qtd: parseInt(e.target.value) || 1 }))}
                    className="w-12 h-8 bg-black/40 border border-white/10 rounded-lg text-xs text-center text-white focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={draftRule.baseType}
                    onChange={(e) => setDraftRule((prev) => ({ ...prev, baseType: e.target.value }))}
                    className="flex-1 h-8 bg-black/40 border border-white/10 rounded-lg text-xs px-2 text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Qualquer" className="bg-zinc-900">
                      Qualquer Porta
                    </option>
                    <option value="USB-C" className="bg-zinc-900">
                      USB-C
                    </option>
                    <option value="USB-A" className="bg-zinc-900">
                      USB-A
                    </option>
                    <option value="HDMI" className="bg-zinc-900">
                      HDMI
                    </option>
                    <option value="RJ45" className="bg-zinc-900">
                      Rede (RJ45)
                    </option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {filterOptions.features.map((feat) => {
                    const isSelected = draftRule.features.includes(feat)
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleDraftFeature(feat)}
                        className={`text-[9px] font-bold px-2 py-1 rounded transition-all ${isSelected ? "bg-blue-500 text-white" : "bg-white/5 text-zinc-400 hover:bg-white/10"}`}
                      >
                        {feat}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={handleAddDraftRule}
                  className="mt-1 w-full h-8 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Adicionar Requisito
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white/[0.01]">
            {filteredNotebooks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <Monitor className="w-8 h-8 text-zinc-600" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Nenhum resultado encontrado</h4>
                <p className="text-zinc-400 text-sm max-w-sm">
                  Os requisitos atuais de conectividade e especificações são muito restritos.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl transition-colors border border-white/10"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredNotebooks.map((nb) => {
                  const isSelected = nb.id === selectedId
                  return (
                    <div
                      key={nb.id}
                      onClick={() => {
                        onChange(nb.id)
                        setOpen(false)
                      }}
                      className={`relative group flex flex-col gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-md ${isSelected ? "bg-white/10 border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" : "bg-black/40 border-white/5 hover:bg-white/10 hover:border-white/15"}`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                      )}
                      <div className="w-full h-36 bg-black/40 rounded-xl p-4 flex items-center justify-center border border-white/5 shadow-inner relative overflow-hidden">
                        <div className="absolute top-2 left-2 flex gap-1 flex-col">
                          {nb.specs.conectividade.map((p, i) =>
                            p.features.length > 0 ? (
                              <span
                                key={i}
                                className="text-[8px] bg-black/60 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded backdrop-blur-md"
                              >
                                {p.qtd}x {p.tipo.replace(" 3.2 Gen2", "")}
                              </span>
                            ) : null
                          )}
                        </div>
                        <img
                          src={nb.imagem}
                          alt={nb.nome}
                          className="max-w-[80%] max-h-[80%] object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col text-left flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-bold uppercase tracking-wider">
                            {nb.marca}
                          </span>
                        </div>
                        <span className="text-base font-bold text-white mb-3 leading-tight">{nb.nome}</span>
                        <div className="mt-auto flex flex-col gap-1.5">
                          <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">CPU</span>
                            <span className="text-[10px] text-zinc-300 font-mono truncate max-w-[140px]">
                              {nb.specs.processador}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">GPU</span>
                            <span className="text-[10px] text-zinc-300 font-mono truncate max-w-[140px]">
                              {nb.specs.placaDeVideo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
