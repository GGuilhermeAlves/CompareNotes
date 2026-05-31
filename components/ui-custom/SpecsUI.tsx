import React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { PortInfo } from "@/types/notebook"

const featureDict: Record<string, { label: string; color: string }> = {
  PD: { label: "Power Delivery", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  DP: { label: "DisplayPort", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  dGPU: { label: "Ligada na dGPU", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  iGPU: { label: "Ligada na iGPU", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
  TB4: { label: "Thunderbolt 4", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" }
}

export function PortBadge({ feature }: { feature: string }) {
  const config = featureDict[feature] || {
    label: feature,
    color: "text-zinc-400 bg-white/5 border-white/10"
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            className={`flex items-center justify-center px-1.5 py-[2px] rounded text-[9px] font-bold tracking-wider border cursor-help transition-colors hover:bg-white/10 ${config.color}`}
          >
            {feature}
          </button>
        }
      />
      <TooltipContent
        side="top"
        className="bg-[#18181b] border-white/10 text-zinc-300 text-[10px] font-medium px-2 py-1.5 shadow-xl"
      >
        <p>{config.label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function ConnectivityList({ ports }: { ports: PortInfo[] }) {
  return (
    <ul className="flex flex-col gap-2.5 col-span-2 mt-1">
      {ports.map((port, i) => (
        <li
          key={i}
          className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 border-b border-white/5 pb-2 last:border-0 last:pb-0"
        >
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-mono text-[11px] font-semibold bg-white/5 px-1.5 py-0.5 rounded">
              {port.qtd}x
            </span>
            <span className="text-zinc-200 text-[13px] font-medium">{port.tipo}</span>
          </div>
          {port.features.length > 0 && (
            <div className="flex items-center gap-1.5">
              {port.features.map((f) => (
                <PortBadge key={f} feature={f} />
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export function BentoBox({ title, icon: Icon, children, className = "", accentColor }: any) {
  return (
    <div
      className={`relative p-6 rounded-[24px] bg-[#121214]/60 backdrop-blur-3xl border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:bg-[#18181b]/80 hover:border-white/10 transition-all duration-500 group hover:z-30 ${className}`}
    >
      {accentColor && (
        <div className="absolute inset-0 overflow-hidden rounded-[24px] pointer-events-none">
          <div
            className="absolute top-0 left-0 w-full h-1 opacity-20 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
            }}
          />
        </div>
      )}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
          <Icon className="w-4 h-4 text-zinc-300" aria-hidden="true" />
        </div>
        <h3 className="text-zinc-100 font-bold text-xs uppercase tracking-widest">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-y-6 gap-x-4 relative z-10">{children}</div>
    </div>
  )
}

export function SpecItem({ label, value, colSpan = false }: { label: string; value: string; colSpan?: boolean }) {
  return (
    <div className={`flex flex-col gap-1.5 ${colSpan ? "col-span-2" : ""}`}>
      <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{label}</span>
      <span className="text-zinc-200 text-[13px] font-medium leading-snug whitespace-nowrap">{value}</span>
    </div>
  )
}
