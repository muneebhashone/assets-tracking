"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/services/auth.mutations";
import { Skeleton } from "../ui/skeleton";
import { User } from "@/types/services/auth.types";
import { NavItem } from "@/types/user.types";
import { AdminDashboardNav } from "../admin-dashboard";

export default function Sidebar({ navItems }: { navItems: NavItem[] }) {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <nav
      className={cn(
        `relative hidden h-screen border-r pt-16 lg:block w-72 bg-[#3491fe]`,
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight text-white ">
              Overview
            </h2>

            {isLoading ? (
              <>
                <div className="py-2">
                  <Skeleton className="h-4 w-[200px] mb-4 py-2" />
                  <Skeleton className="h-4 w-[200px] mb-4 py-2" />
                  <Skeleton className="h-4 w-[200px] mb-4 py-2" />
                  <Skeleton className="h-4 w-[200px] mb-4 py-2" />
                  <Skeleton className="h-4 w-[200px] mb-4 py-2" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </>
            ) : user?.user.role === "SUPER_ADMIN" ? (
              <AdminDashboardNav user={user?.user as User} items={navItems} />
            ) : (
              <DashboardNav user={user?.user as User} items={navItems} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
