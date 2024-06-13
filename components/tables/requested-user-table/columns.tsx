"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Badge } from "@/components/ui/badge";
import { User } from "@/services/auth.mutations";
import { UserRole } from "@/utils/constants";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),

    enableSorting: false,
    enableHiding: false,
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <p>{UserRole[row.original.role as keyof typeof UserRole]}</p>
    ),
  },

  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "isActive",
    header: "Active",
  },
  {
    accessorKey: "status",
    header: "Status",
  },

  {
    accessorKey: "permissions",
    header: "Permissions",

    cell: ({ row }) => (
      <div>
        {row.original.permissions?.map((permission, index) => (
          <Badge
            key={index}
            className="bg-green-600 text-xs text-white px-2 py-1  m-0.5"
          >
            {permission}
          </Badge>
        ))}
      </div>
    ),
    size: 10,
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
