"use client";

import { useCurrentUser } from "@/services/auth.mutations";
import { UserRole } from "@/utils/constants";
import { Skeleton } from "../ui/skeleton";

export default function DashboardPage() {
  const { data, isFetching } = useCurrentUser();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight ">
          {" "}
          {isFetching
            ? "Loading..."
            : `Hi, Welcome back ${data?.user.name} ( ${
                UserRole[data?.user.role as keyof typeof UserRole]
              } )`}
        </h2>
        {/* {data?.user.role !== ROLE.SUPER_ADMIN && ( */}
        <div className="flex flex-col ">
          <h2 className="text-2xl font-bold tracking-tight ">
            {isFetching ?  <Skeleton className="w-10 h-3"/>  : `Credits: ${data?.user.credits }`}
          </h2>
        </div>
        {/* )} */}
      </div>

      {/* {session?.user.role === ROLE.USER ? (
        <UserDashboardView  {session?.user.role === ROLE.USER ? (
        <UserDashboardView
          chartData={chartData}
          kpiData={kpiData as IKpiData["userKpi"]}
        />
      ) : (
        <DashboardView
          adminData={adminChart}
          kpiData={kpiData as IKpiData["adminKpi"]}
          chartData={chartData}
        />
      )}
          chartData={chartData}
          kpiData={kpiData as IKpiData["userKpi"]}
        />
      ) : (
        <DashboardView
          adminData={adminChart}
          kpiData={kpiData as IKpiData["adminKpi"]}
          chartData={chartData}
        />
      )} */}
    </div>
  );
}
