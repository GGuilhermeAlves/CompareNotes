import React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function IconButton({
  icon: Icon,
  label,
  isActive,
  onClick,
  activeClass = "bg-white/15 text-white",
  tooltipPos = "top",
  className = "p-2.5"
}: any) {
  const side = tooltipPos === "topRight" ? "top" : tooltipPos

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={`group rounded-full flex items-center justify-center transition-all ${className} ${isActive ? activeClass : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            <Icon className="w-4 h-4" />
          </button>
        }
      />
      <TooltipContent
        side={side}
        className="bg-[#18181b] border-white/10 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 shadow-xl"
      >
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
