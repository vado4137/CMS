"use client"

import { useState } from "react";
import { BlockRenderer } from "@/components/cms/BlockRenderer";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, LayoutPanelLeft, Plus, Save, Trash2 } from "lucide-react";
import { CMSBlock, BlockType } from "@/types/cms";
import { updateLandingPage } from "@/lib/actions/faction"; // Unsere Server Action
import { toast } from "sonner";
import { BlockSettings } from "../[id]/edit/_components/BlockSettings";

export function CMSEditor({ faction, initialBlocks }: { faction: any, initialBlocks: CMSBlock[] }) {
  const [blocks, setBlocks] = useState<CMSBlock[]>(initialBlocks);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // 1. Neuen Block zum State hinzufügen
  const addBlock = (type: BlockType) => {
    const newBlock: CMSBlock = {
      id: crypto.randomUUID(),
      type,
      content: type === 'HERO' 
        ? { title: "Neuer Titel", subtitle: "Hier Text einfügen", ctaText: "Mehr Infos" } 
        : { items: [{ label: "Beamte", value: "0" }] }
    };
    setBlocks([...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
  };

  // 2. Inhalt eines Blocks aktualisieren (Live-Vorschau!)
  const updateBlock = (id: string, newContent: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  // 3. Speichern in DB
  const handleSave = async () => {
    const res = await updateLandingPage(faction.id, blocks);
    if (res.success) toast.success("Seite erfolgreich gespeichert!");
    else toast.error("Fehler beim Speichern");
  };

  const activeBlock = blocks.find(b => b.id === activeBlockId);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* SIDEBAR: Werkzeuge */}
      <aside className="w-96 bg-white border-r shadow-xl z-20 flex flex-col">
        <div className="p-6 border-b bg-slate-900 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutPanelLeft className="w-5 h-5 text-blue-400" /> Editor
          </h2>
          <Button size="sm" variant="secondary" onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" /> Save
          </Button>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase text-slate-400">Blöcke hinzufügen</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => addBlock('HERO')} className="gap-2">
                <Plus className="w-3 h-3" /> Hero
              </Button>
              <Button variant="outline" size="sm" onClick={() => addBlock('STATS')} className="gap-2">
                <Plus className="w-3 h-3" /> Stats
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase text-slate-400">Seitenstruktur</p>
            {blocks.map((block) => (
              <div 
                key={block.id}
                onClick={() => setActiveBlockId(block.id)}
                className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer transition-all ${
                  activeBlockId === block.id ? 'bg-blue-600 text-white border-blue-700 shadow-md' : 'bg-white hover:border-blue-400'
                }`}
              >
                <span className="text-sm font-bold">{block.type}</span>
                <Trash2 
                  className={`w-4 h-4 hover:text-red-400 ${activeBlockId === block.id ? 'text-blue-200' : 'text-slate-400'}`} 
                  onClick={(e) => { e.stopPropagation(); setBlocks(blocks.filter(b => b.id !== block.id)); }} 
                />
              </div>
            ))}
          </div>

          {/* HIER KOMMEN DIE EINSTELLUNGEN REIN */}
          {activeBlock && (
            <div className="pt-6 border-t mt-6">
              <BlockSettings block={activeBlock} onUpdate={(content) => updateBlock(activeBlock.id, content)} />
            </div>
          )}
        </div>
      </aside>

      {/* VORSCHAU: Das Fenster zur Welt */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-200">
        <div className="bg-white border-b p-3 flex justify-center gap-4 shadow-sm z-10">
          <Button variant={viewMode === "desktop" ? "default" : "outline"} size="icon" onClick={() => setViewMode("desktop")}>
            <Monitor className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "mobile" ? "default" : "outline"} size="icon" onClick={() => setViewMode("mobile")}>
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className={`mx-auto bg-white shadow-2xl transition-all duration-500 overflow-hidden rounded-md border ${
              viewMode === "desktop" ? "w-full max-w-5xl" : "w-[375px] min-h-[667px]"
          }`}>
             <BlockRenderer blocks={blocks} />
          </div>
        </div>
      </main>
    </div>
  );
}