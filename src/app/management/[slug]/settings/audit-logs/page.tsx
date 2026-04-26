import db from "@/lib/db";
import { verifySettingsAccess } from "@/lib/dal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { History, User, ShieldAlert, ArrowRight } from "lucide-react";

export default async function AuditLogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await verifySettingsAccess(slug);

  // Alle Logs der Fraktion laden
  const logs = await db.auditLog.findMany({
    where: { faction: { slug } },
    orderBy: { createdAt: "desc" },
    take: 100, // Die letzten 100 Einträge
  });

  // Da wir IDs in den Logs speichern, müssen wir für die Anzeige 
  // eigentlich die Namen der Beteiligten laden. 
  // (In einer echten App würde man die Relationen im Prisma Model nutzen)

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-slate-400" /> Audit Logs
        </h2>
        <p className="text-muted-foreground text-sm">
          Lückenlose Aufzeichnung aller administrativen Änderungen innerhalb der Fraktion.
        </p>
      </header>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[180px]">Zeitpunkt</TableHead>
              <TableHead>Aktion</TableHead>
              <TableHead>Ausführender (Actor ID)</TableHead>
              <TableHead>Ziel (Member ID)</TableHead>
              <TableHead>Änderung</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="text-xs">
                <TableCell className="text-slate-500 font-medium">
                  {format(new Date(log.createdAt), "dd.MM.yyyy HH:mm", { locale: de })}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-bold uppercase text-[9px] tracking-tighter">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-slate-400">{log.actorId.slice(-6)}</TableCell>
                <TableCell className="font-mono text-slate-400">{log.memberId.slice(-6)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 line-through opacity-50">{log.oldValue || "---"}</span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                    <span className="text-emerald-600 font-bold">{log.newValue || "---"}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400 italic">
                  Noch keine Einträge im Audit-Log vorhanden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}