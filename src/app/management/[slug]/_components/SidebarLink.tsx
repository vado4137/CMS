"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  ShieldAlert, 
  Building2, 
  MapPin, 
  GraduationCap,
  Settings,
  History
} from "lucide-react"

// Das Mapping-Objekt wandelt den String wieder in ein Icon um
const ICON_MAP = {dashboard: LayoutDashboard,
  users: Users,
  settings: Settings,
  files: FileText,
  calendar: Calendar,
  shield: ShieldAlert,
  building: Building2,
  map: MapPin,
  graduation: GraduationCap, // HIER: Mappe den Namen "graduation" auf das Icon
  history: History
}

interface SidebarLinkProps {
  href: string
  name: string
  icon: keyof typeof ICON_MAP // Verwendet die Keys aus unserem Mapping
  color?: "blue" | "red"
}

export function SidebarLink({ href, name, icon, color = "blue" }: SidebarLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  
  // Icon-Komponente auswählen
  const IconComponent = ICON_MAP[icon]

  const activeStyles = color === "blue" 
    ? "bg-blue-50 text-blue-700 shadow-sm" 
    : "bg-red-50 text-red-700 shadow-sm"

  const hoverStyles = color === "blue"
    ? "hover:bg-blue-50 hover:text-blue-700"
    : "hover:bg-red-50 hover:text-red-700"

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all group ${
        isActive ? activeStyles : `text-slate-500 ${hoverStyles}`
      }`}
    >
      <IconComponent className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "" : "text-slate-400"}`} />
      {name}
    </Link>
  )
}