import { currentUser } from "@/services/auth.services";
import { PermissionsType } from "@/types/user.types";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import { ComponentType } from "react";

const RoleWrapper =
  (Component: ComponentType<unknown | any>, permission: PermissionsType) =>
  async (props: any) => {
    const { user } = await currentUser(cookies().get("accessToken")?.value);

    if (!user.permissions.includes(permission)) {
      redirect("./");
    }
    return <Component {...props} />;
  };

export default RoleWrapper;
