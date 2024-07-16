"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems, userNavItems } from "@/constants/data";
import { useCurrentUser } from "@/services/auth.mutations";
import { MenuIcon } from "lucide-react";

import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { AdminDashboardNav } from "../admin-dashboard";
import { User } from "@/types/services/auth.types";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const { data: currentUser, isLoading } = useCurrentUser();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="!px-0 bg-[#3491fe]">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">
              Overview
            </h2>
            <div className="space-y-1">
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
              ) : currentUser?.user.role === "SUPER_ADMIN" ? (
                <AdminDashboardNav
                  user={currentUser?.user as User}
                  items={navItems}
                />
              ) : (
                <DashboardNav
                  user={currentUser?.user as User}
                  items={navItems}
                />
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
