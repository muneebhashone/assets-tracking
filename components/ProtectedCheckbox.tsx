import { useCurrentUser } from "@/services/auth.mutations";
import { Shipment } from "@/services/shipment.queries";
import { UserPermissions } from "@/types/services/auth.types";
import { checkPermissions } from "@/utils/user.utils";
import { Row, Table } from "@tanstack/react-table";
import React from "react";
import { IUserModified } from "./tables/active-user-table/active-user";
import { Checkbox } from "./ui/checkbox";

interface ProtectedProps<T> {
  table?: Table<T>;
  row?: Row<T>;
  type: "user" | "shipment";
}

const ProtectedCheckbox: React.FC<
  ProtectedProps<Shipment> | ProtectedProps<IUserModified>
> = ({ table, row, type }) => {
  const { data: user } = useCurrentUser();

  const userDeletePermission: UserPermissions[] = ["DELETE_USER"];
  const shipmentDeletePermission: UserPermissions[] = ["DELETE_SHIPMENT"];
  return (
    checkPermissions(
      user?.user.permissions as UserPermissions[],
      type === "user" ? userDeletePermission : shipmentDeletePermission,
    ) && (
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
