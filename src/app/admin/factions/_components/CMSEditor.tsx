"use client"

import { useState } from "react";
import { BlockRenderer } from "@/components/cms/BlockRenderer";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, LayoutPanelLeft } from "lucide-react";

export function CMSEditor({ faction, initialBlocks }: { faction: any, initialBlocks: any[] }) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex h-screen bg-slate-100">
      {/* LINKSE SEITE: Die Werkzeugbank */}
      <aside className="w-96 bg-white border-r shadow-xl z-20 flex flex-col">
        <div className="p-6 border-b bg-slate-900 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutPanelLeft className="w-5 h-5 text-blue-400" />
            Editor: {faction.name}
          </h2>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Hier kommen deine Formulare hin, um Texte der Blöcke zu ändern */}
          <p className="text-sm text-muted-foreground italic">
            Klicke rechts auf einen Block oder wähle ihn hier aus, um den Inhalt zu bearbeiten.
          </p>
          
          <div className="space-y-2">
            <Button onClick={() => {/* Logik zum Hinzufügen */}} className="w-full">
              Neuen Block hinzufügen
            </Button>
          </div>
        </div>
      </aside>

      {/* RECHTE SEITE: Die visuelle Live-Vorschau */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Toolbar für die Vorschau */}
        <div className="bg-white border-b p-2 flex justify-center gap-4 shadow-sm z-10">
          <Button 
            variant={viewMode === "desktop" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("desktop")}
          >
            <Monitor className="w-4 h-4 mr-2" /> Desktop
          </Button>
          <Button 
            variant={viewMode === "mobile" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("mobile")}
          >
            <Smartphone className="w-4 h-4 mr-2" /> Mobile
          </Button>
        </div>

        {/* Der "virtuelle" Bildschirm */}
        <div className="flex-1 overflow-y-auto p-12 bg-slate-200 transition-all">
          <div 
            className={`mx-auto bg-white shadow-2xl transition-all duration-500 overflow-hidden ${
              viewMode === "desktop" ? "w-full max-w-5xl" : "w-[375px] min-h-[667px]"
            }`}
          >
            {/* Hier wird die Seite ECHTZEIT gerendert */}
            <div className="bg-white">
               <BlockRenderer blocks={blocks} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}