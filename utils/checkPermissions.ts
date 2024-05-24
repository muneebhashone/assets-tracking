import { PERMISSIONS } from "@prisma/client";

export const checkPermissions = (
  userPermissions: PERMISSIONS[],
  permissionsToCheck: PERMISSIONS[],
) => {
  return permissionsToCheck.every((perm) => userPermissions.includes(perm));
};
