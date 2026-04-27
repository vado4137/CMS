"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toggleInstructorPermission } from "@/lib/actions/training"
import { Settings2, Loader2, User } from "lucide-react"
import { toast } from "sonner"

export function ManageInstructorsDialog({ factionSlug, trainingType, allMembers }: any) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (memberId: string, isCurrentlyAuthorized: boolean) => {
    setLoadingId(memberId);
    try {
      await toggleInstructorPermission(factionSlug, trainingType.id, memberId, !isCurrentlyAuthorized);
      toast.success("Ausbilder-Berechtigung aktualisiert");
    } catch (e) {
      toast.error("Aktion fehlgeschlagen");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2">
          <Settings2 className="h-3.5 w-3.5" /> Ausbilder verwalten
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Zulassung: {trainingType.name}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[350px] overflow-y-auto pr-2 space-y-1">
          {allMembers.map((m: any) => {
            const isAuth = trainingType.authorizedInstructors.some((i: any) => i.id === m.id);
            return (
              <div key={m.id} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                    {m.firstName[0]}{m.lastName[0]}
                  </div>
                  <span className="text-sm font-medium">{m.firstName} {m.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {loadingId === m.id && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
                  <Checkbox 
                    checked={isAuth} 
                    onCheckedChange={() => handleToggle(m.id, isAuth)}
                    disabled={loadingId !== null}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}