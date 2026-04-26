"use client"

import { CMSBlock } from "@/types/cms"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface BlockSettingsProps {
  block: CMSBlock
  onUpdate: (content: any) => void
}

export function BlockSettings({ block, onUpdate }: BlockSettingsProps) {
  // Handler für einfache Textfelder
  const handleFieldChange = (key: string, value: string) => {
    onUpdate({ ...block.content, [key]: value })
  }

  // Spezielle Logik für die Stats-Items
  const handleStatChange = (index: number, key: string, value: string) => {
    const newItems = [...(block.content.items || [])]
    newItems[index] = { ...newItems[index], [key]: value }
    onUpdate({ ...block.content, items: newItems })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <header>
        <h3 className="text-lg font-bold">Einstellungen: {block.type}</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">ID: {block.id.slice(0, 8)}</p>
      </header>
      
      <Separator />

      {/* HERO EDITOR */}
      {block.type === "HERO" && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Haupt-Titel</Label>
            <Input 
              id="title" 
              value={block.content.title || ""} 
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="z.B. LSPD: Dein Freund & Helfer"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subtitle">Untertitel</Label>
            <Textarea 
              id="subtitle" 
              value={block.content.subtitle || ""} 
              onChange={(e) => handleFieldChange("subtitle", e.target.value)}
              placeholder="Eine kurze Beschreibung..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cta">Button Text</Label>
            <Input 
              id="cta" 
              value={block.content.ctaText || ""} 
              onChange={(e) => handleFieldChange("ctaText", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* STATS EDITOR */}
      {block.type === "STATS" && (
        <div className="space-y-4">
          {/* HIER war der Fehler: Label muss mit /Label geschlossen werden */}
          <Label>Statistik-Einträge</Label> 
          
          {block.content.items?.map((item: any, i: number) => (
            <Card key={i} className="bg-slate-50/50">
              <CardContent className="p-3 grid grid-cols-2 gap-2">
                <Input 
                  placeholder="Label (z.B. Beamte)" 
                  value={item.label} 
                  onChange={(e) => handleStatChange(i, "label", e.target.value)}
                />
                <Input 
                  placeholder="Wert (z.B. 45)" 
                  value={item.value} 
                  onChange={(e) => handleStatChange(i, "value", e.target.value)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!["HERO", "STATS"].includes(block.type) && (
        <p className="text-sm italic text-muted-foreground">Für diesen Block-Typ ist noch kein Editor konfiguriert.</p>
      )}
    </div>
  )
}