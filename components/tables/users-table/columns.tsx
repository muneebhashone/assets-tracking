"use client";
import ProtectedCheckbox from "@/components/ProtectedCheckbox";
import ProtectedHeader from "@/components/ProtectedHeader";
import SwitchMutation from "@/components/SwitchMutation";
import { toast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/services/auth.mutations";
import { useUserToggleActive } from "@/services/user.mutations";
import { UserWithWallet } from "@/types/services/auth.types";
import { PermissionsType } from "@/types/user.types";
import { UserRole } from "@/utils/constants";
import { checkPermissions } from "@/utils/user.utils";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<UserWithWallet>[] = [
  {
    id: "select",
    header: ({ table }) => <ProtectedCheckbox table={table} type="user" />,
    cell: ({ row }) => <ProtectedCheckbox row={row} type="user" />,

    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "S#",
    cell: ({ row }) => <p className="text-center">{row?.index + 1}</p>,
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
    accessorKey: "isActive",

    header: () => (
      <ProtectedHeader columnName="Active" permission="EDIT_COMPANY" />
    ),
    cell: ({ row }) => {
      /* eslint-disable */
      const { mutate: toggleActive, isPending: isTogglingActive } =
        useUserToggleActive({
          onSuccess(data) {
            toast({
              variant: "default",
              description: data.message,
              title: "Success",
            });
          },
          onError(error) {
            toast({
              variant: "destructive",
              description: error.response?.data.message,
              title: "Error",
            });
          },
        });
      /* eslint-disable */
      const { data: currentUser } = useCurrentUser();
      return (
        (currentUser?.user.role === "SUPER_ADMIN" ||
          checkPermissions(currentUser?.user.permissions as PermissionsType[], [
            "EDIT_USER",
          ])) && (
          <>
            <SwitchMutation
              switchState={row.original.isActive}
              mutationFn={() => toggleActive({ id: row.original.id })}
              disabled={isTogglingActive}
            />
          </>
        )
      );
    },
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.status?.toLowerCase()}</div>
    ),
  },

  // {
  //   accessorKey: "permissions",
  //   header: ({ table }) => (
  //     <ProtectedHeader columnName="Permissions" permission="VIEW_PERMISSIONS" />
  //   ),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   cell: ({ row }) => <PermissionUpdate row={row} />,

  //   maxSize: 20,
  //   minSize: 30,
  // },
  {
    accessorKey: "credits",

    header: () => (
      <ProtectedHeader columnName="Credits" permission="CREATE_SHIPMENT" />
    ),
    cell: ({ row }) => {
      const { data: currentUser } = useCurrentUser();
      return (
        (currentUser?.user.role === "SUPER_ADMIN" ||
          checkPermissions(currentUser?.user.permissions as PermissionsType[], [
            "CREATE_SHIPMENT",
          ])) && (
          <>
            <p>{row.original?.wallet?.credits}</p>
          </>
        )
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
