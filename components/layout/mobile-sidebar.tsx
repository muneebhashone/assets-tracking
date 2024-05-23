"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { adminNavItems, userNavItems } from "@/constants/data";
import { auth } from "@/lib/auth-options";
import { ROLE } from "@/types";
import { MenuIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const { role } = session?.user;
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
              <DashboardNav
                items={role === ROLE.SUPER_ADMIN ? adminNavItems : userNavItems}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
