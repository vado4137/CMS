"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RankBadge } from "@/components/shared/RankBadge"
import { Badge } from "@/components/ui/badge"
import { StatusDropdown } from "./StatusDropdown" // Falls du das Status-Dropdown schon hast

export const columns = (factionSlug: string): ColumnDef<any>[] => [
  {
    accessorKey: "badgeNumber",
    header: "Badge #",
    cell: ({ row }) => (
      <code className="font-mono font-bold text-blue-600">
        #{row.original.badgeNumber || "---"}
      </code>
    ),
  },
  {
    accessorKey: "name", // Wichtig für die Suchfunktion in der DataTable
    header: "Name",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold">{row.original.firstName} {row.original.lastName}</span>
        <span className="text-[10px] text-slate-400">{row.original.user.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "rank",
    header: "Dienstgrad",
    cell: ({ row }) => (
      <RankBadge 
        name={row.original.rank.name} 
        level={row.original.rank.level} 
      />
    ),
  },
  {
    accessorKey: "departments",
    header: "Abteilungen",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.departments.map((d: any) => (
          <Badge key={d.id} variant="secondary" className="text-[9px] uppercase px-1 py-0">
            {d.shortName || d.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={row.original.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"}>
        {row.original.status}
      </Badge>
    ),
  }
]