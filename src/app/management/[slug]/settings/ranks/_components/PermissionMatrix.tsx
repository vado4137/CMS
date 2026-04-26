"use client"

import { useState } from "react"
import { FACTION_PERMISSIONS, PermissionKey } from "@/config/permissions"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updateRankPermissions } from "@/lib/actions/rank"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

const GROUPS = {
  "Allgemeine Verwaltung": ["MANAGE_FACTION", "MANAGE_SETTINGS", "VIEW_LOGS", "MANAGE_LOCATIONS"],
  "Personal & Ränge": ["MANAGE_MEMBERS", "MANAGE_RECRUITING", "MANAGE_RANKS", "MANAGE_FULL_RANKS", "MANAGE_DEPARTMENTS"],
  "Ausbildung": ["MANAGE_TRAINING", "MANAGE_TRAININGTYPES", "ACCEPT_TRAINING", "VIEW_TRAINING"],
  "Kalender & Events": ["VIEW_CALENDAR", "CREATE_ABSENCES", "CREATE_EVENTS", "VIEW_EVENTS"],
  "Dokumente & Forum": ["VIEW_DOCUMENTS", "MANAGE_DOCUMENTS"]
}

export function PermissionMatrix({ factionSlug, rank }: { factionSlug: string, rank: any }) {
  // WICHTIG: Sicherstellen, dass perms ein Objekt ist
  const [perms, setPerms] = useState<Record<string, boolean>>(
    typeof rank.permissions === 'object' ? (rank.permissions as any) : {}
  )
  const [loading, setLoading] = useState(false)

  const handleToggle = (key: string, checked: boolean) => {
    setPerms(prev => ({ ...prev, [key]: checked }))
  }

  const save = async () => {
    setLoading(true)
    try {
        const res = await updateRankPermissions(factionSlug, rank.id, perms as any)
        if (res.success) toast.success(`Rechte für ${rank.name} gespeichert!`)
    } catch (e) {
        toast.error("Fehler beim Speichern")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="space-y-10 pb-24">
      {Object.entries(GROUPS).map(([groupName, keys]) => (
        <section key={groupName} className="space-y-4">
          <div className="flex items-center gap-4">
            <h4 className="font-bold text-sm text-blue-600 uppercase tracking-widest">{groupName}</h4>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>
          
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {keys.map((key) => {
              const isChecked = !!perms[key];
              return (
                <Card 
                  key={key} 
                  // UX-Bonus: Die ganze Karte umschalten lassen
                  onClick={() => handleToggle(key, !isChecked)}
                  className={`cursor-pointer transition-all border-2 ${
                    isChecked ? 'border-blue-500 bg-blue-50/30' : 'hover:border-slate-300'
                  }`}
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 select-none">
                      <Label className="text-sm font-bold leading-tight block mb-1 cursor-pointer">
                        {FACTION_PERMISSIONS[key as PermissionKey]}
                      </Label>
                      <code className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                        {key}
                      </code>
                    </div>
                    {/* Pointer-events-none sorgt dafür, dass der Switch den Klick nicht blockiert */}
                    <div className="pointer-events-none">
                      <Switch checked={isChecked} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ))}

      <div className="fixed bottom-6 right-6 lg:right-12 z-50">
        <Button onClick={(e) => { e.stopPropagation(); save(); }} size="lg" className="shadow-2xl px-10 gap-2 h-14 text-lg font-bold" disabled={loading}>
          {loading ? "Wird gespeichert..." : "Änderungen übernehmen"}
        </Button>
      </div>
    </div>
  )
}