"use client";

import { useCurrentUser } from "@/services/auth.mutations";
import { PermissionsType } from "@/types/user.types";
import { checkPermissions } from "@/utils/user.utils";
import React from "react";
interface ProtectedHeaderProps {
  columnName: string;
  permission: PermissionsType;
}
const ProtectedHeader = ({ columnName, permission }: ProtectedHeaderProps) => {
  const { data: currentuser } = useCurrentUser();
  return checkPermissions(currentuser?.user.permissions as PermissionsType[], [
    permission,
  ]) ? (
    <p>{columnName}</p>
  ) : null;
};

export default ProtectedHeader;
