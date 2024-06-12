"use client";


import DashboardView from "@/components/dashboard/DashboardView";
import UserDashboardView from "@/components/dashboard/UserView";
import { auth } from "@/lib/auth-options";
import { useCurrentUser } from "@/services/auth.mutations";

import { BarDatum } from "@nivo/bar";
import { User } from "@prisma/client";
import { Session } from "next-auth";

export default function page() {
  // const session = { user: { name: "Test", role: "TestRole" } };
  const { data, isFetching } = useCurrentUser();
  // const { user } = data;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight ">
          Hi, Welcome back {isFetching ? "Loading" : data?.user.name}
        </h2>
        {/* {data?.user.role !== ROLE.SUPER_ADMIN && ( */}
        <div className="flex flex-col ">
          <h2 className="text-2xl font-bold tracking-tight ">
            Credits: {data?.user.credits}
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
