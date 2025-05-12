"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/services/auth.mutations";
import { Skeleton } from "../ui/skeleton";
import { User } from "@/types/services/auth.types";
import { NavItem } from "@/types/user.types";
import { AdminDashboardNav } from "../admin-dashboard";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar({ navItems }: { navItems: NavItem[] }) {
  const { data: user, isLoading } = useCurrentUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav
      className={cn(
        `relative h-screen border-r pt-16 lg:block bg-[#3491fe] transition-all duration-300`,
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 bg-white rounded-full p-1.5 border shadow-sm cursor-pointer hover:bg-gray-50"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {!isCollapsed && (
              <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight text-white">
                Overview
              </h2>
            )}

            {isLoading ? (
              <>
                <div className="py-2">
                  <Skeleton
                    className={cn(
                      "h-4 mb-4 py-2",
                      isCollapsed ? "w-12" : "w-[200px]",
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-4 mb-4 py-2",
                      isCollapsed ? "w-12" : "w-[200px]",
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-4 mb-4 py-2",
                      isCollapsed ? "w-12" : "w-[200px]",
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-4 mb-4 py-2",
                      isCollapsed ? "w-12" : "w-[200px]",
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-4 mb-4 py-2",
                      isCollapsed ? "w-12" : "w-[200px]",
                    )}
                  />
                  <Skeleton
                    className={cn("h-4", isCollapsed ? "w-12" : "w-[200px]")}
                  />
                </div>
              </>
            ) : user?.user.role === "SUPER_ADMIN" ? (
              <AdminDashboardNav
                user={user?.user as User}
                items={navItems}
                isCollapsed={isCollapsed}
              />
            ) : (
              <DashboardNav
                user={user?.user as User}
                items={navItems}
                isCollapsed={isCollapsed}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
