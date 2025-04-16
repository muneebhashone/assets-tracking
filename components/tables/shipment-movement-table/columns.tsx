"use client";
import type { Movement } from "@/types/services/shipment.types";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Anchor } from "lucide-react";
import moment from "moment";

export const columns: ColumnDef<Movement>[] = [
  {
    id: "location.name",
    accessorFn: (row) => row.location?.name,
    header: "Location",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original?.location?.name ? row.original?.location?.name : "-"}
      </div>
    ),
    enableGrouping: true,
    aggregatedCell: () => null,
  },
  {
    id: "description",
    accessorFn: (row) => row.description,
    header: "Moves",
    cell: ({ row }) => (
      <div
        className="max-w-[200px] truncate"
        title={row.original.description || ""}
      >
        {row.original.description || "-"}
      </div>
    ),
    enableGrouping: false,
  },
  {
    id: "date",
    accessorFn: (row) => row.date,
    header: "Date",
    cell: ({ row }) => (
      <div className="text-slate-500 ">
        {row.original.date
          ? moment(row.original.date).format("DD/MM/YYYY")
          : "-"}
      </div>
    ),
    enableGrouping: false,
  },
  {
    id: "vessel",
    accessorFn: (row) => row.vessel?.name,
    header: "Vessel",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        {row.original.vessel?.name ? (
          <>
            <Anchor className="h-3.5 w-3.5 text-blue-400" />
            <span>{row.original.vessel.name}</span>
          </>
        ) : (
          "-"
        )}
      </div>
    ),
    enableGrouping: false,
  },
  {
    id: "actions",
    header: "Status",
    cell: ({ row }) => {
      return row.original?.actual ? (
        <div className="flex justify-center">
          <CheckCircle2 className="w-5 h-5 text-white" fill="#7dd3a8" />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-5 h-5 rounded-full border border-slate-200 " />
        </div>
      );
    },
    enableGrouping: false,
  },
];
