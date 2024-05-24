import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { auth } from "@/lib/auth-options";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";

export default async function Sidebar() {
  const session = await auth();
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
            <DashboardNav
              user={session?.user as unknown as User}
              items={navItems}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
