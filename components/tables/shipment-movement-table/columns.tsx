"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2 } from "lucide-react";
import moment from "moment";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div>{row.original.location}</div>,
  },
  {
    accessorKey: "moves",
    header: "Moves",
    cell: ({ row }) => <div>{row.original.moves}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div>{moment(row.original.date).format("MM/DD/YYYY")}</div>
    ),
  },
  {
    accessorKey: "vessel",
    header: "Vessel",
    cell: ({ row }) => <div>{row.original.vessel}</div>,
  },

  {
    id: "actions",
    cell: () => <CheckCircle2 className="w-6 h-6 text-white " fill="#50C878" />,
  },
];
