export const checkPermissions = (
  userPermissions: string[],
  permissionsToCheck: string[],
) => {
  return permissionsToCheck.every((perm) => userPermissions.includes(perm));
};
