"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { User } from "@/types/services/auth.types";
import { UserRole } from "@/utils/constants";

export const columns: ColumnDef<User>[] = [
  
  {
    header: "S#",
    cell: ({ row }) => <p className="text-center">{row?.index + 1}</p>,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "company.name",
    header: "Company",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <p>{UserRole[row.original.role as keyof typeof UserRole]}</p>
    ),
  },

  {
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.status?.toLowerCase()}</div>
    ),
  },
  {
    accessorKey: "credits",
    header: "Credits",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
