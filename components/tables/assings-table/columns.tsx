"use client";
import { AssignsType } from "@/services/admin/assigns.queries";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<AssignsType>[] = [
  {
    header: "S#",
    cell: ({ row }) => <p className="text-start ms-3">{row?.index + 1}</p>,
  },
  {
    accessorKey: "id",
    header: "Assignment Id",
  },
  {
    accessorKey: "parent.name",
    header: "Sub Admin",
  },
  {
    accessorKey: "child.name",
    header: "White label",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
