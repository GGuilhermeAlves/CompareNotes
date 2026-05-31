export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-black/40 backdrop-blur-md py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">© {new Date().getFullYear()} CompareNotes.</p>
        <div className="flex gap-6">
          <span className="text-zinc-500 text-sm hover:text-white cursor-pointer transition-colors">
            Sobre o Projeto
          </span>
          <span className="text-zinc-500 text-sm hover:text-white cursor-pointer transition-colors">Contato</span>
        </div>
      </div>
    </footer>
  )
}
