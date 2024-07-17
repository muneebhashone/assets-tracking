import { currentUser } from "@/services/auth.services";
import { User } from "@/types/services/auth.types";
import { PermissionsType } from "@/types/user.types";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import { ComponentType } from "react";
/* eslint-disable */

const checkSuperAdminOrPermission = (
  user: User,
  permission?: PermissionsType,
) => {
  if (permission) {
    if (user?.role === "SUPER_ADMIN") {
      return true;
    }
    return user?.permissions?.includes(permission);
  } else {
    return user?.role === "SUPER_ADMIN";
  }
};
const PermissionWrapper =
  (Component: ComponentType<any>, permission?: PermissionsType) =>
  async (props: any) => {
    const user = (await currentUser(cookies().get("accessToken")?.value))?.user;

    if (!checkSuperAdminOrPermission(user, permission)) {
      redirect("./");
      return null;
    }

    return <Component {...props} />;
  };

export default PermissionWrapper;
