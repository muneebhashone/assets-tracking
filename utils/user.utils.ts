import { PermissionsType, RoleType } from "@/types/user.types";

export const checkPermissions = (
  userPermissions: PermissionsType[],
  permissionsToCheck: PermissionsType[],
) => {
  return permissionsToCheck?.every((perm) => userPermissions?.includes(perm));
};

export const checkRoles = (userRole: RoleType, rolesToCheck: RoleType[]) => {
  return rolesToCheck?.includes(userRole);
};

export function parseJwt(token?: string) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}
