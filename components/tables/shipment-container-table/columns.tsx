"use client";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "container",
    header: "Container",
    cell: ({ row }) => <div>{row.original.container}</div>,
  },
  {
    accessorKey: "emptyToShipper",
    header: "Emtpy To Shipper",
    cell: ({ row }) => <div>{row.original.emptyToShipper}</div>,
  },
  {
    accessorKey: "gateIn",
    header: "Gate In",
    cell: ({ row }) => (
      <div>{moment(row.original.gateIn).format("MM/DD/YYYY")}</div>
    ),
  },
  {
    accessorKey: "gateOut",
    header: "Gate Out",
    cell: ({ row }) => (
      <div>{moment(row.original.gateOut).format("MM/DD/YYYY")}</div>
    ),
  },
  {
    accessorKey: "emptyReturn",
    header: "Empty Return",
    cell: ({ row }) => (
      <div>{moment(row.original.emptyReturn).format("MM/DD/YYYY")}</div>
    ),
  },
];
