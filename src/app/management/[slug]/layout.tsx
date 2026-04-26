import { verifyMembership, hasPermission } from "@/lib/dal"
import { MANAGEMENT_NAV, SETTINGS_NAV } from "@/config/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarLink } from "./_components/SidebarLink"
import { ShieldCheck } from "lucide-react"

export default async function FactionManagementLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params
  const member = await verifyMembership(slug)

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEMENU */}
      <aside className="w-72 bg-white border-r flex flex-col sticky top-0 h-screen shadow-sm z-20">
        {/* Faction Header */}
        <div className="p-6 border-b bg-slate-900 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-sm tracking-tight uppercase leading-none">{member.faction.name}</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Management</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-8 overflow-y-auto pt-6">
          {/* Haupt-Navigation */}
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Dienstbetrieb</p>
            {MANAGEMENT_NAV.map((item) => (
            <SidebarLink 
                key={item.href} 
                href={`/management/${slug}${item.href}`} 
                name={item.name} 
                icon={item.icon as any} // Hier wird nun der String "dashboard", "users" etc. übergeben
            />
            ))}
          </div>

          <Separator className="mx-4 opacity-50" />

          {/* Settings-Navigation (Nur für Admins) */}
          {hasPermission(member, "MANAGE_FACTION") && (
            <div className="space-y-1">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Verwaltung</p>
              {SETTINGS_NAV.map((item) => {
                if (item.permission && !hasPermission(member, item.permission as any)) return null
                return (
                    <SidebarLink 
                    key={item.href} 
                    href={`/management/${slug}${item.href}`} 
                    name={item.name} 
                    icon={item.icon as any} 
                    color="red"
                  />
                )
              })}
            </div>
          )}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t bg-slate-50/80">
          <div className="flex items-center gap-3 p-2 bg-white border rounded-xl shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
              {member.firstName[0]}{member.lastName[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate text-slate-900">{member.firstName} {member.lastName}</p>
              <p className="text-[10px] text-blue-600 font-medium truncate uppercase tracking-tighter">{member.rank.name}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}