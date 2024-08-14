"use client";
import { Movement } from "@/types/services/shipment.types";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2 } from "lucide-react";
import moment from "moment";

export const columns: ColumnDef<Movement>[] = [
  {
    header: "Location",
    cell: ({ row }) => (
      <div>
        {row.original?.location?.name ? row.original?.location?.name : "-"}
      </div>
    ),
  },
  {
    header: "Moves",
    cell: ({ row }) => <div>{row.original.description}</div>,
  },
  {
    header: "Date",
    cell: ({ row }) => (
      <div>{moment(row.original.date).format("DD/MM/YYYY")}</div>
    ),
  },
  {
    header: "Vessel",
    cell: ({ row }) => <div>{row.original.vessel?.name || "-"}</div>,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        Boolean(row.original?.actual) ? (
          <CheckCircle2 className="w-6 h-6 text-white " fill="#50C878" />
        ):<p className="text-center w-6 h-6">-</p>
      );
    },
  },
];
