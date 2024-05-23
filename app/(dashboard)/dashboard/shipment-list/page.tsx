import { userData } from "@/actions/usersActions";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@/lib/auth-options";
import { ROLE } from "@/types";
import { User } from "@prisma/client";
import { Session } from "next-auth";
import React from "react";
type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};
const page = async (props: Props) => {
  const session = (await auth()) as Session;
  const user = (await userData(session.user.id as string)) as User;

  return (
    <ScrollArea className="h-full ">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {session?.user.role !== ROLE.SUPER_ADMIN ? (
          <UserDashboard searchParams={props.searchParams} />
        ) : (
          <AdminDashboard searchParams={props.searchParams} />
        )}
      </div>
    </ScrollArea>
  );
};

export default page;
