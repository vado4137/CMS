import Link from "next/link"

export function Copyright() {
  return (
    <div className="fixed bottom-2 right-4 z-[100] pointer-events-none">
      <Link 
        href="https://steamcommunity.com/id/VadoHaze/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="pointer-events-auto text-[9px] uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors duration-200 font-medium"
      >
        © 2026 CMS BY VadoHaze(J.Haze)
      </Link>
    </div>
  )
}