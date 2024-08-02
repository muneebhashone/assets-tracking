"use client";
import { Container } from "@/types/services/shipment.types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

export const columns: ColumnDef<Container>[] = [
  {
    accessorKey: "container",
    header: "Container",
    cell: ({ row }) => <div>{row.original.containerNumber}</div>,
  },
  {
    accessorKey: "emptyToShipper",
    header: "Emtpy To Shipper",
    cell: ({ row }) => (
      <div>
        {row.original?.emptyToShipper
          ? moment(row.original?.emptyToShipper).format("MM/DD/YYYY")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "gateIn",
    header: "Gate In",
    cell: ({ row }) => (
      <div>
        {row.original?.gateIn
          ? moment(row.original?.gateIn).format("MM/DD/YYYY")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "gateOut",
    header: "Gate Out",
    cell: ({ row }) => (
      <div>
        {row.original?.gateOut
          ? moment(row.original?.gateOut).format("MM/DD/YYYY")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "emptyReturn",
    header: "Empty Return",
    cell: ({ row }) => (
      <div>
        {row.original?.emptyReturn
          ? moment(row.original?.emptyReturn).format("MM/DD/YYYY")
          : "N/A"}
      </div>
    ),
  },
];
