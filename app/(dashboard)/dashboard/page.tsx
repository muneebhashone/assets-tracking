// "use client";

import { userData } from "@/actions/usersActions";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";

import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@/lib/auth-options";
import { ROLE } from "@/types";
import { User } from "@prisma/client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

export default async function page() {
  // const { data: session } = useSession();
  const session = await auth() as Session
  const user = await userData(session.user.id as string) as User
  return (
    <ScrollArea className="h-full ">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight ">
            Hi, Welcome back {session?.user?.name}
          </h2>
          {session?.user.role !== ROLE.ADMIN && (
            <div className="flex flex-col ">
              <h2 className="text-2xl font-bold tracking-tight ">Credits</h2>
              <h2 className="text-3xl font-bold tracking-tight ">
                {user?.credits}
              </h2>
            </div>
          )}
        </div>
        {session?.user.role !== ROLE.ADMIN ? (
          <UserDashboard />
        ) : (
          <AdminDashboard />
        )}
      </div>
    </ScrollArea>
  );
}
