import { DashboardNav } from "@/components/dashboard-nav";
import { adminNavItems, userNavItems } from "@/constants/data";
import { auth } from "@/lib/auth-options";
import { cn } from "@/lib/utils";
import { ROLE } from "@/types";

export default async function Sidebar() {
  const session = await auth();
  const { role } = session?.user;
  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 lg:block w-72 bg-[#3491fe]`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight text-white ">
              Overview
            </h2>
            <DashboardNav
              items={role === ROLE.ADMIN ? adminNavItems : userNavItems}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
