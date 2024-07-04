"use client";
import ProtectedCheckbox from "@/components/ProtectedCheckbox";
import PermissionUpdate from "@/components/forms/permission-update-form";
import { UserRole } from "@/utils/constants";
import { ColumnDef } from "@tanstack/react-table";
import { IUserModified } from "./users";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<IUserModified>[] = [
  {
    id: "select",
    header: ({ table }) => <ProtectedCheckbox table={table} type="user" />,
    cell: ({ row }) => <ProtectedCheckbox row={row} type="user" />,

    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "S#",
    cell: ({ row }) => <p className="text-center">{row?.index}</p>,
  },
  {
    accessorKey: "id",
    header: "User ID",
    
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
