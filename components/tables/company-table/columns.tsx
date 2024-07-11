"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Company } from "@/services/companies.queries";
import SwitchMutation from "@/components/SwitchMutation";
import { useToggleCompanyActive } from "@/services/companies.mutations";
import { toast } from "@/components/ui/use-toast";
import ProtectedHeader from "@/components/ProtectedHeader";
import { useCurrentUser } from "@/services/auth.mutations";
import { checkPermissions } from "@/utils/user.utils";
import { PermissionsType } from "@/types/user.types";

export const columns: ColumnDef<Company>[] = [
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
    header: "ID ",
  },
  {
    accessorKey: "name",
    header: "Name ",
  },
  {
    accessorKey: "isActive",

    header: () => (
      <ProtectedHeader columnName="Active" permission="EDIT_COMPANY" />
    ),
    cell: ({ row }) => {
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
      const { data: currentUser } = useCurrentUser();
      return (
        checkPermissions(currentUser?.user.permissions as PermissionsType[], [
          "EDIT_COMPANY",
        ]) && (
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
    accessorKey: "createdAt",
    header: "Creation Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
