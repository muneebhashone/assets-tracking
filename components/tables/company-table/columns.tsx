"use client";
import ProtectedHeader from "@/components/ProtectedHeader";
import SwitchMutation from "@/components/SwitchMutation";
import { toast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/services/auth.mutations";
import { useToggleCompanyActive } from "@/services/companies.mutations";
import { Company } from "@/services/companies.queries";
import { PermissionsType } from "@/types/user.types";
import { checkPermissions } from "@/utils/user.utils";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "id",
    header: "ID ",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    accessorKey: "isActive",

    header: () => (
      <ProtectedHeader columnName="Active" permission="EDIT_COMPANY" />
    ),
    cell: ({ row }) => {
      /* eslint-disable */
      const { mutate: toggleActive } = useToggleCompanyActive({
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
            "EDIT_COMPANY",
          ])) && (
          <>
            <SwitchMutation
              switchState={row.original.isActive}
              mutationFn={() => toggleActive({ id: row.original.id })}
            />
          </>
        )
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "industry",
    header: "Industry",
  },
  {
    accessorKey: "[users]?.credits",
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
            <p>{row.original.users?.[0]?.credits || 0}</p>
          </>
        )
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creation Date",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
