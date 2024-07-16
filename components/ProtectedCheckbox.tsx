import { useCurrentUser } from "@/services/auth.mutations";
import { Shipment } from "@/services/shipment.queries";

import { checkPermissions } from "@/utils/user.utils";
import { Row, Table } from "@tanstack/react-table";
import React from "react";

import { User } from "@/types/services/auth.types";
import { PermissionsType } from "@/types/user.types";
import { Checkbox } from "./ui/checkbox";

interface ProtectedProps<T> {
  table?: Table<T>;
  row?: Row<T>;
  type: "user" | "shipment";
}

const ProtectedCheckbox: React.FC<
  ProtectedProps<Shipment> | ProtectedProps<User>
> = ({ table, row, type }) => {
  const { data: user } = useCurrentUser();

  const userDeletePermission: PermissionsType[] = ["DELETE_USER"];
  const shipmentDeletePermission: PermissionsType[] = ["DELETE_SHIPMENT"];
  return (
    (user?.user.role === "SUPER_ADMIN" ||
      checkPermissions(
        user?.user.permissions as PermissionsType[],
        type === "user" ? userDeletePermission : shipmentDeletePermission,
      )) && (
      <>
        {table && (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        )}
        {row && (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        )}
      </>
    )
  );
};

export default ProtectedCheckbox;
