"use client"

import React, { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, ContactShadows, Environment, Grid } from "@react-three/drei"
import {
  Cpu,
  Monitor,
  Scale,
  Laptop,
  Link,
  Keyboard,
  Box,
  Layers,
  Grid3X3,
  RotateCw,
  Ruler,
  Combine,
  Eye,
  EyeOff,
  PanelTop,
  PanelRight,
  RectangleHorizontal
} from "lucide-react"

// Importações do Base UI e Componentes
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { NotebookData } from "@/types/notebook"

// Componentes 3D e UI Customizados
import { CameraRig } from "@/components/3d/CameraRig"
import { Notebook3D } from "@/components/3d/Notebook3D"
import { IconButton } from "@/components/ui-custom/IconButton"
import { BentoBox, SpecItem, ConnectivityList } from "@/components/ui-custom/SpecsUI"
import { NotebookSelectorModal } from "@/components/ui-custom/NotebookSelectorModal"

function createSlug(nome: string) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/* ==============================================================================
   TELA PRINCIPAL (Interface de Comparação)
   ============================================================================== */
function CompareInterface() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Lê os valores iniciais do URL usando slugs
  const slugNb1 = searchParams.get("nb1")
  const slugNb2 = searchParams.get("nb2")

  const initialMode = (searchParams.get("view") || "stacked") as "stacked" | "sideBySide" | "merged"

  const [notebooks, setNotebooks] = useState<NotebookData[]>([])
  const [selectedId1, setSelectedId1] = useState<number>(1)
  const [selectedId2, setSelectedId2] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUI, setShowUI] = useState(true)

  const [viewSettings, setViewSettings] = useState({
    mode: initialMode,
    alignX: -1,
    alignZ: -1,
    isXRay: initialMode === "merged",
    showGrid: true,
    autoRotate: false,
    showRuler: true,
    cornerRadius: 0.05,
    camView: "top" as "perspective" | "top" | "front" | "side" | "free"
  })

  const handleModeChange = useCallback((mode: "stacked" | "sideBySide" | "merged") => {
    setViewSettings((prev) => ({ ...prev, mode, isXRay: mode === "merged" ? true : prev.isXRay }))
  }, [])

  const updateSetting = useCallback((key: keyof typeof viewSettings, value: any) => {
    setViewSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    async function loadNotebooks() {
      try {
        setIsLoading(true)
        setLoadError(null)

        const response = await fetch("/api/notebooks", { cache: "no-store" })

        if (!response.ok) {
          throw new Error("Erro ao buscar notebooks no banco")
        }

        const data: NotebookData[] = await response.json()

        setNotebooks(data)

        const initialNb1 = data.find((n) => createSlug(n.nome) === slugNb1)?.id || data[0]?.id || 1
        const initialNb2 = data.find((n) => createSlug(n.nome) === slugNb2)?.id || data[1]?.id || data[0]?.id || 1

        setSelectedId1(initialNb1)
        setSelectedId2(initialNb2)
      } catch (error) {
        console.error(error)
        setLoadError("Não foi possível carregar os notebooks do Supabase.")
      } finally {
        setIsLoading(false)
      }
    }

    loadNotebooks()
  }, [slugNb1, slugNb2])

  // Sincroniza o Estado com o URL sempre que houver alterações
  useEffect(() => {
    if (notebooks.length === 0) return

    const notebook1 = notebooks.find((n) => n.id === selectedId1)
    const notebook2 = notebooks.find((n) => n.id === selectedId2)

    if (!notebook1 || !notebook2) return

    const params = new URLSearchParams()

    params.set("nb1", createSlug(notebook1.nome))
    params.set("nb2", createSlug(notebook2.nome))
    params.set("view", viewSettings.mode)

    const newUrl = `${pathname}?${params.toString()}`

    if (`${pathname}?${searchParams.toString()}` !== newUrl) {
      router.replace(newUrl, { scroll: false })
    }
  }, [notebooks, selectedId1, selectedId2, viewSettings.mode, pathname, router, searchParams])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 700)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#09090b] text-zinc-300 flex items-center justify-center">
        Carregando notebooks...
      </main>
    )
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-[#09090b] text-zinc-300 flex items-center justify-center text-center px-6">
        {loadError}
      </main>
    )
  }

  if (notebooks.length === 0) {
    return (
      <main className="min-h-screen bg-[#09090b] text-zinc-300 flex items-center justify-center text-center px-6">
        Nenhum notebook cadastrado no banco.
      </main>
    )
  }

  const nb1 = notebooks.find((n) => n.id === selectedId1) || notebooks[0]
  const nb2 = notebooks.find((n) => n.id === selectedId2) || notebooks[1] || notebooks[0]

  const color1 = "#3b82f6"
  const color2 = "#f97316"

  const scale = 0.1
  const isNb1Base =
    nb1.dimensoes.largura * nb1.dimensoes.profundidade >= nb2.dimensoes.largura * nb2.dimensoes.profundidade
  const baseNotebook = isNb1Base ? nb1 : nb2
  const topNotebook = isNb1Base ? nb2 : nb1

  let yPos1 = (nb1.dimensoes.espessura / 2) * scale
  let yPos2 = (nb2.dimensoes.espessura / 2) * scale
  let xOffset1 = 0,
    zOffset1 = 0,
    xOffset2 = 0,
    zOffset2 = 0

  if (viewSettings.mode === "stacked") {
    if (isNb1Base) yPos2 = nb1.dimensoes.espessura * scale + (nb2.dimensoes.espessura / 2) * scale
    else yPos1 = nb2.dimensoes.espessura * scale + (nb1.dimensoes.espessura / 2) * scale
  }

  if (viewSettings.mode === "sideBySide") {
    xOffset1 = -2.0
    xOffset2 = 2.0
  } else {
    const offsetX = viewSettings.alignX * ((baseNotebook.dimensoes.largura - topNotebook.dimensoes.largura) / 2) * scale
    const offsetZ =
      viewSettings.alignZ * ((baseNotebook.dimensoes.profundidade - topNotebook.dimensoes.profundidade) / 2) * scale
    if (isNb1Base) {
      xOffset2 = offsetX
      zOffset2 = offsetZ
    } else {
      xOffset1 = offsetX
      zOffset1 = offsetZ
    }
  }

  const getAlignmentName = () => {
    const { alignX, alignZ } = viewSettings
    if (alignX === 0 && alignZ === 0) return "Centro Exato"
    if (alignX === -1 && alignZ === -1) return "Topo Esquerda"
    if (alignX === 0 && alignZ === -1) return "Alinhar Fundo"
    if (alignX === 1 && alignZ === -1) return "Topo Direita"
    if (alignX === -1 && alignZ === 0) return "Alinhar Esquerda"
    if (alignX === 1 && alignZ === 0) return "Alinhar Direita"
    if (alignX === -1 && alignZ === 1) return "Base Esquerda"
    if (alignX === 0 && alignZ === 1) return "Alinhar Frente"
    if (alignX === 1 && alignZ === 1) return "Base Direita"
    return ""
  }

  const alignmentIcons = [
    {
      x: -1,
      z: -1,
      label: "Topo Esquerda",
      svg: (
        <svg width="12" height="12" viewBox="0 0 12 12">
          <polygon points="0,0 12,0 0,12" fill="currentColor" />
        </svg>
      )
    },
    {
      x: 0,
      z: -1,
      label: "Alinhar Fundo",
      svg: (
        <svg width="14" height="10" viewBox="0 0 14 10">
          <polygon points="7,0 14,10 0,10" fill="currentColor" />
        </svg>
      )
    },
    {
      x: 1,
      z: -1,
      label: "Topo Direita",
      svg: (
        <svg width="12" height="12" viewBox="0 0 12 12">
          <polygon points="0,0 12,0 12,12" fill="currentColor" />
        </svg>
      )
    },
    {
      x: -1,
      z: 0,
      label: "Alinhar Esquerda",
      svg: (
        <svg width="10" height="14" viewBox="0 0 10 14">
          <polygon points="0,7 10,0 10,14" fill="currentColor" />
        </svg>
      )
    },
    { x: 0, z: 0, label: "Centro Exato", svg: <div className="w-1.5 h-1.5 rounded-full bg-current"></div> },
    {
      x: 1,
      z: 0,
      label: "Alinhar Direita",
      svg: (
        <svg width="10" height="14" viewBox="0 0 10 14">
          <polygon points="10,7 0,0 0,14" fill="currentColor" />
        </svg>
      )
    },
    {
      x: -1,
      z: 1,
      label: "Base Esquerda",
      svg: (
        <svg width="12" height="12" viewBox="0 0 12 12">
          <polygon points="0,0 0,12 12,12" fill="currentColor" />
        </svg>
      )
    },
    {
      x: 0,
      z: 1,
      label: "Alinhar Frente",
      svg: (
        <svg width="14" height="10" viewBox="0 0 14 10">
          <polygon points="0,0 14,0 7,10" fill="currentColor" />
        </svg>
      )
    },
    {
      x: 1,
      z: 1,
      label: "Base Direita",
      svg: (
        <svg width="12" height="12" viewBox="0 0 12 12">
          <polygon points="12,0 12,12 0,12" fill="currentColor" />
        </svg>
      )
    }
  ]

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-blue-500/30 antialiased relative">
        {/* DOCK SUPERIOR FLUTUANTE */}
        <div
          className={`fixed top-16 left-0 w-full z-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? "translate-y-0 opacity-100" : "-translate-y-[150%] opacity-0 pointer-events-none"}`}
        >
          <div className="bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center p-1">
                      <img
                        src={nb1.imagem}
                        alt={nb1.nome}
                        className="max-w-full max-h-full object-contain drop-shadow-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{nb1.marca}</span>
                      <span className="text-sm font-bold text-white">{nb1.nome}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: color1, boxShadow: `0 0 12px ${color1}` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center p-1">
                      <img
                        src={nb2.imagem}
                        alt={nb2.nome}
                        className="max-w-full max-h-full object-contain drop-shadow-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{nb2.marca}</span>
                      <span className="text-sm font-bold text-white">{nb2.nome}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: color2, boxShadow: `0 0 12px ${color2}` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-16 relative mt-4">
            <div className="w-full h-[650px] rounded-[32px] overflow-hidden border border-white/10 bg-gradient-to-b from-zinc-900 to-[#09090b] relative shadow-2xl ring-1 ring-black/50">
              <div className="absolute bottom-8 right-8 z-50">
                <IconButton
                  icon={showUI ? EyeOff : Eye}
                  label={showUI ? "Ocultar Interface" : "Mostrar Interface"}
                  onClick={() => setShowUI(!showUI)}
                  tooltipPos="topRight"
                  className="p-3 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                />
              </div>

              <div
                className={`absolute top-1/2 right-8 -translate-y-1/2 z-30 flex flex-col items-center p-1.5 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out ${showUI ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-12 pointer-events-none"}`}
              >
                <IconButton
                  icon={Box}
                  label="Perspectiva 3D"
                  isActive={viewSettings.camView === "perspective"}
                  className="p-3"
                  tooltipPos="left"
                  onClick={() => {
                    updateSetting("camView", "perspective")
                    updateSetting("autoRotate", false)
                  }}
                />
                <div className="h-px w-6 bg-white/10 my-1"></div>
                <IconButton
                  icon={PanelTop}
                  label="Vista Superior"
                  isActive={viewSettings.camView === "top"}
                  className="p-3"
                  tooltipPos="left"
                  onClick={() => {
                    updateSetting("camView", "top")
                    updateSetting("autoRotate", false)
                  }}
                />
                <IconButton
                  icon={RectangleHorizontal}
                  label="Vista Frontal"
                  isActive={viewSettings.camView === "front"}
                  className="p-3"
                  tooltipPos="left"
                  onClick={() => {
                    updateSetting("camView", "front")
                    updateSetting("autoRotate", false)
                    updateSetting("alignX", -1)
                    updateSetting("alignZ", 1)
                  }}
                />
                <IconButton
                  icon={PanelRight}
                  label="Vista Lateral"
                  isActive={viewSettings.camView === "side"}
                  className="p-3"
                  tooltipPos="left"
                  onClick={() => {
                    updateSetting("camView", "side")
                    updateSetting("autoRotate", false)
                    updateSetting("alignX", 1)
                    updateSetting("alignZ", -1)
                  }}
                />
              </div>

              <div
                className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center p-1.5 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out ${showUI ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-8 pointer-events-none"}`}
              >
                <div className="flex items-center gap-1 px-2">
                  <IconButton
                    icon={Layers}
                    label="Visualização Empilhada"
                    isActive={viewSettings.mode === "stacked"}
                    tooltipPos="top"
                    onClick={() => handleModeChange("stacked")}
                  />
                  <IconButton
                    icon={Laptop}
                    label="Visualização Lado a Lado"
                    isActive={viewSettings.mode === "sideBySide"}
                    tooltipPos="top"
                    onClick={() => handleModeChange("sideBySide")}
                  />
                  <IconButton
                    icon={Combine}
                    label="Visualização Mesclada"
                    isActive={viewSettings.mode === "merged"}
                    tooltipPos="top"
                    onClick={() => handleModeChange("merged")}
                  />
                </div>
                <div className="w-px h-6 bg-white/10 mx-2"></div>
                <div className="flex items-center gap-1 px-2">
                  <IconButton
                    icon={Box}
                    label="Modo Raio-X"
                    isActive={viewSettings.isXRay}
                    activeClass="bg-emerald-500/20 text-emerald-400"
                    tooltipPos="top"
                    onClick={() => updateSetting("isXRay", !viewSettings.isXRay)}
                  />
                  <IconButton
                    icon={Ruler}
                    label="Mostrar Medidas"
                    isActive={viewSettings.showRuler}
                    activeClass="bg-indigo-500/20 text-indigo-400"
                    tooltipPos="top"
                    onClick={() => updateSetting("showRuler", !viewSettings.showRuler)}
                  />
                  <IconButton
                    icon={Grid3X3}
                    label="Exibir Grade 3D"
                    isActive={viewSettings.showGrid}
                    tooltipPos="top"
                    onClick={() => updateSetting("showGrid", !viewSettings.showGrid)}
                  />
                  <IconButton
                    icon={RotateCw}
                    label="Rotação Automática"
                    isActive={viewSettings.autoRotate}
                    activeClass="bg-amber-500/20 text-amber-400"
                    tooltipPos="top"
                    onClick={() => {
                      updateSetting("autoRotate", !viewSettings.autoRotate)
                      if (!viewSettings.autoRotate) updateSetting("camView", "free")
                    }}
                  />
                </div>
                <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <div className="hidden sm:flex items-center gap-3 px-4 py-2 group relative">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold cursor-default">
                          Bordas
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="0.05"
                          step="0.005"
                          value={viewSettings.cornerRadius}
                          onChange={(e) => updateSetting("cornerRadius", parseFloat(e.target.value))}
                          className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                      </div>
                    }
                  />
                  <TooltipContent
                    side="top"
                    className="bg-[#18181b] border-white/10 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 shadow-xl"
                  >
                    <p>Arredondamento: {Math.round(viewSettings.cornerRadius * 200)}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div
                className={`absolute top-8 left-8 z-30 flex flex-col gap-4 w-[240px] max-w-[80vw] transition-all duration-500 ease-in-out ${showUI ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-12 pointer-events-none"}`}
              >
                <NotebookSelectorModal
                  label="Notebook 1"
                  selectedId={selectedId1}
                  onChange={setSelectedId1}
                  color={color1}
                  notebooks={notebooks}
                />
                <NotebookSelectorModal
                  label="Notebook 2"
                  selectedId={selectedId2}
                  onChange={setSelectedId2}
                  color={color2}
                  notebooks={notebooks}
                />
              </div>

              {(viewSettings.mode === "stacked" || viewSettings.mode === "merged") && (
                <div
                  className={`absolute bottom-8 left-8 z-30 bg-black/40 backdrop-blur-2xl border border-white/10 p-3.5 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col items-center transition-all duration-500 ease-in-out ${showUI ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-12 pointer-events-none"}`}
                >
                  <p className="text-zinc-400 text-[9px] uppercase tracking-widest font-bold mb-0.5">
                    Offset de Alinhamento
                  </p>
                  <p className="text-white text-[11px] font-medium mb-2.5">{getAlignmentName()}</p>
                  <div className="grid grid-cols-3 gap-1">
                    {alignmentIcons.map((btn, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger
                          render={
                            <button
                              type="button"
                              onClick={() => {
                                updateSetting("alignX", btn.x)
                                updateSetting("alignZ", btn.z)
                              }}
                              aria-label={btn.label}
                              className={`group w-7 h-7 flex items-center justify-center rounded-md text-xs transition-all duration-200 ${viewSettings.alignX === btn.x && viewSettings.alignZ === btn.z ? "bg-white/20 text-white shadow-inner scale-95" : "bg-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-300"}`}
                            >
                              {btn.svg}
                            </button>
                          }
                        />
                        <TooltipContent
                          side="top"
                          className="bg-[#18181b] border-white/10 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 shadow-xl"
                        >
                          <p>{btn.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}

              <Canvas camera={{ position: [0, 6, 0.01], fov: 45 }}>
                <Suspense fallback={null}>
                  <Environment preset="city" />
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />

                  <CameraRig view={viewSettings.camView} />

                  <Notebook3D
                    dimensoes={nb1.dimensoes}
                    cor={color1}
                    posicao={[xOffset1, yPos1, zOffset1]}
                    isXRay={viewSettings.isXRay}
                    showRuler={viewSettings.showRuler}
                    cornerRadius={viewSettings.cornerRadius}
                    camView={viewSettings.camView}
                  />
                  <Notebook3D
                    dimensoes={nb2.dimensoes}
                    cor={color2}
                    posicao={[xOffset2, yPos2, zOffset2]}
                    isXRay={viewSettings.isXRay}
                    showRuler={viewSettings.showRuler}
                    cornerRadius={viewSettings.cornerRadius}
                    camView={viewSettings.camView}
                  />

                  {viewSettings.showGrid && (
                    <Grid infiniteGrid cellColor="#27272a" sectionColor="#3f3f46" fadeDistance={30} />
                  )}
                  <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={30} blur={2.5} far={4.5} color="#000000" />

                  <OrbitControls
                    makeDefault
                    target={[0, 0.4, 0]}
                    autoRotate={viewSettings.autoRotate}
                    autoRotateSpeed={1.0}
                    enableZoom={true}
                    maxPolarAngle={Math.PI / 2}
                    onStart={() => updateSetting("camView", "free")}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>

          {/* ========================================== */}
          {/* SESSÃO DE ESPECIFICAÇÕES */}
          {/* ========================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-24">
            {/* LADO 1 (Notebook 1) */}
            <section className="flex flex-col">
              <div className="mb-8 relative flex items-center justify-center p-8 bg-black/20 backdrop-blur-2xl rounded-[32px] border border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <img
                  src={nb1.imagem}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain scale-[1.5] blur-[60px] opacity-20 pointer-events-none saturate-200"
                />
                <img
                  src={nb1.imagem}
                  alt={nb1.nome}
                  className="max-h-[220px] object-contain drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-700 relative"
                />
                <div className="absolute top-6 left-6 flex items-center gap-3 z-20 bg-[#09090b]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color1, boxShadow: `0 0 12px ${color1}` }}
                  ></div>
                  <span className="text-white font-bold text-sm tracking-tight">
                    {nb1.marca} {nb1.nome}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <BentoBox title="Desempenho" icon={Cpu} accentColor={color1}>
                  <SpecItem label="Processador" value={nb1.specs.processador} />
                  <SpecItem label="Placa de Vídeo" value={nb1.specs.placaDeVideo} />
                  <SpecItem label="Memória RAM" value={`${nb1.specs.ram.capacidade} ${nb1.specs.ram.tipo}`} />
                  <SpecItem label="Frequência RAM" value={nb1.specs.ram.frequencia} />
                  <SpecItem label="Armazenamento" value={nb1.specs.armazenamento.capacidade} />
                  <SpecItem label="Tipo Armaz." value={nb1.specs.armazenamento.tipo} />
                </BentoBox>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <BentoBox title="Tela" icon={Monitor} accentColor={color1}>
                    <SpecItem label="Tamanho" value={nb1.specs.tela.tamanho} />
                    <SpecItem label="Painel" value={nb1.specs.tela.painel} />
                    <SpecItem label="Resolução" value={nb1.specs.tela.resolucao} />
                    <SpecItem label="Frequência" value={nb1.specs.tela.frequencia} />
                    <SpecItem label="Cores" value={nb1.specs.tela.cores} />
                    <SpecItem label="Brilho" value={nb1.specs.tela.brilho} />
                  </BentoBox>

                  <BentoBox title="Chassi & Peso" icon={Scale} accentColor={color1}>
                    <SpecItem label="Construção" value={nb1.specs.construcao} colSpan />
                    <SpecItem
                      label="Dimensões"
                      value={`${nb1.dimensoes.largura} x ${nb1.dimensoes.profundidade} x ${nb1.dimensoes.espessura} cm`}
                    />
                    <SpecItem label="Peso" value={nb1.specs.peso} />
                    <SpecItem label="Bateria" value={nb1.specs.bateria} />
                    <SpecItem label="Fonte" value={nb1.specs.fonte} />
                  </BentoBox>
                </div>

                <BentoBox title="Conectividade" icon={Link} accentColor={color1}>
                  <ConnectivityList ports={nb1.specs.conectividade} />
                </BentoBox>

                <BentoBox title="Periféricos & OS" icon={Keyboard} accentColor={color1}>
                  <SpecItem label="Teclado" value={nb1.specs.teclado} />
                  <SpecItem label="Webcam" value={nb1.specs.webcam} />
                  <SpecItem label="Sistema" value={nb1.specs.so} colSpan />
                </BentoBox>
              </div>
            </section>

            {/* LADO 2 (Notebook 2) */}
            <section className="flex flex-col">
              <div className="mb-8 relative flex items-center justify-center p-8 bg-black/20 backdrop-blur-2xl rounded-[32px] border border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <img
                  src={nb2.imagem}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain scale-[1.5] blur-[60px] opacity-20 pointer-events-none saturate-200"
                />
                <img
                  src={nb2.imagem}
                  alt={nb2.nome}
                  className="max-h-[220px] object-contain drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-700 relative"
                />
                <div className="absolute top-6 right-6 flex items-center gap-3 z-20 bg-[#09090b]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                  <span className="text-white font-bold text-sm tracking-tight">
                    {nb2.marca} {nb2.nome}
                  </span>
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color2, boxShadow: `0 0 12px ${color2}` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6">
                <BentoBox title="Desempenho" icon={Cpu} accentColor={color2}>
                  <SpecItem label="Processador" value={nb2.specs.processador} />
                  <SpecItem label="Placa de Vídeo" value={nb2.specs.placaDeVideo} />
                  <SpecItem label="Memória RAM" value={`${nb2.specs.ram.capacidade} ${nb2.specs.ram.tipo}`} />
                  <SpecItem label="Frequência RAM" value={nb2.specs.ram.frequencia} />
                  <SpecItem label="Armazenamento" value={nb2.specs.armazenamento.capacidade} />
                  <SpecItem label="Tipo Armaz." value={nb2.specs.armazenamento.tipo} />
                </BentoBox>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <BentoBox title="Tela" icon={Monitor} accentColor={color2}>
                    <SpecItem label="Tamanho" value={nb2.specs.tela.tamanho} />
                    <SpecItem label="Painel" value={nb2.specs.tela.painel} />
                    <SpecItem label="Resolução" value={nb2.specs.tela.resolucao} />
                    <SpecItem label="Frequência" value={nb2.specs.tela.frequencia} />
                    <SpecItem label="Cores" value={nb2.specs.tela.cores} />
                    <SpecItem label="Brilho" value={nb2.specs.tela.brilho} />
                  </BentoBox>

                  <BentoBox title="Chassi & Peso" icon={Scale} accentColor={color2}>
                    <SpecItem label="Construção" value={nb2.specs.construcao} colSpan />
                    <SpecItem
                      label="Dimensões"
                      value={`${nb2.dimensoes.largura} x ${nb2.dimensoes.profundidade} x ${nb2.dimensoes.espessura} cm`}
                    />
                    <SpecItem label="Peso" value={nb2.specs.peso} />
                    <SpecItem label="Bateria" value={nb2.specs.bateria} />
                    <SpecItem label="Fonte" value={nb2.specs.fonte} />
                  </BentoBox>
                </div>

                <BentoBox title="Conectividade" icon={Link} accentColor={color2}>
                  <ConnectivityList ports={nb2.specs.conectividade} />
                </BentoBox>

                <BentoBox title="Periféricos & OS" icon={Keyboard} accentColor={color2}>
                  <SpecItem label="Teclado" value={nb2.specs.teclado} />
                  <SpecItem label="Webcam" value={nb2.specs.webcam} />
                  <SpecItem label="Sistema" value={nb2.specs.so} colSpan />
                </BentoBox>
              </div>
            </section>
          </div>
        </div>
      </main>
    </TooltipProvider>
  )
}

/* ==============================================================================
   ATENÇÃO: WRAPPER PRINCIPAL COM SUSPENSE OBRIGATÓRIO PARA CARREGAMENTO DO THREE.JS!!!
   ============================================================================== */
export default function Home() {
  return (
    <Suspense fallback={null}>
      <CompareInterface />
    </Suspense>
  )
}
