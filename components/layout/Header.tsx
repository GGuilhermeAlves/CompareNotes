import { LaptopMinimalCheck } from "lucide-react"

export default function Header() {
  return (
    <header className="w-full h-16 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LaptopMinimalCheck className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Compare<span className="text-zinc-500">Notes</span>
          </h1>
        </div>
      </div>
    </header>
  )
}
