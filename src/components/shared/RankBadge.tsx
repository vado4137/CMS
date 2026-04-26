// src/components/shared/RankBadge.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RankBadgeProps {
  name: string
  level: number
  className?: string
}

export function RankBadge({ name, level, className }: RankBadgeProps) {
  // Logik für Level-basiertes Styling (Hierarchie-Visualisierung)
  const getRankStyle = (lvl: number) => {
    if (lvl >= 90) return "bg-slate-950 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]" // High Command
    if (lvl >= 70) return "bg-blue-900 text-blue-50 border-blue-400" // Führungsebene
    if (lvl >= 40) return "bg-blue-100 text-blue-800 border-blue-200" // Erfahrene
    return "bg-slate-100 text-slate-600 border-slate-200" // Standard
  }

  return (
    <Badge 
      variant="outline" 
      className={cn("font-bold tracking-tight px-2 py-0.5 whitespace-nowrap", getRankStyle(level), className)}
    >
      <span className="opacity-50 mr-1 text-[8px]">LVL {level}</span>
      {name}
    </Badge>
  )
}