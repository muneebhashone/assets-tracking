import { UserPermissions } from "@/types/services/auth.types";

export const checkPermissions = (
  userPermissions: UserPermissions[],
  permissionsToCheck: UserPermissions[],
) => {
  return permissionsToCheck.every((perm) => userPermissions.includes(perm));
};
