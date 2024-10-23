"use client";

import { useCurrentUser } from "@/services/auth.mutations";
import { PermissionsType } from "@/types/user.types";
import { checkPermissions } from "@/utils/user.utils";
import React, { ReactNode } from "react";
interface ProtectedHeaderProps {
  columnName: string;
  permission: PermissionsType;
  children?: ReactNode;
  otherProps?: React.HTMLAttributes<HTMLDivElement>;
}
const ProtectedHeader = ({
  columnName,
  permission,
  children,
  ...otherProps
}: ProtectedHeaderProps) => {
  const { data: currentuser } = useCurrentUser();
  return currentuser?.user.role === "SUPER_ADMIN" ||
    checkPermissions(currentuser?.user.permissions as PermissionsType[], [
      permission,
    ]) ? (
    <p className="flex justify-center gap-2" {...otherProps}>
      {columnName} {children && children}
    </p>
  ) : null;
};

export default ProtectedHeader;
