import { ColumnDef } from "@tanstack/react-table";
import { Button } from "react-day-picker";
import { Payment } from "./shipmentTable";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "STATUS",
  },
  {
    accessorKey: "shipment",
    header: "SHIPMENT",
  },
  {
    accessorKey: "do",
    header: "DO",
  },
  {
    accessorKey: "da",
    header: "DA",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
