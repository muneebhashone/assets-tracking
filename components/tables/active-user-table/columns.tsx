"use client";
import PermissionUpdate from "@/components/forms/permission-update-form";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@/utils/constants";
import { ColumnDef } from "@tanstack/react-table";
import { IUserModified } from "./active-user";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<IUserModified>[] = [
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

    cell: ({ row }) => <PermissionUpdate row={row} />,

    maxSize: 20,
    minSize: 30,
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
