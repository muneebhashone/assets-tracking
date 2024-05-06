"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { ClockIcon, PackageIcon, TruckIcon } from "../Icons/index";
import { BarDatum, ResponsiveBar } from "@nivo/bar";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { ROLE } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import { BarChart } from "../BarChart";
import { IKpiData } from "@/app/(dashboard)/dashboard/page";
export interface AdminData {
  name: string;
  count: number;
}

interface DashboardProps {
  adminData: readonly BarDatum[];
  chartData: readonly BarDatum[];
  kpiData: IKpiData["adminKpi"];
}
export default function DashboardView({
  adminData,
  chartData,
  kpiData,
}: DashboardProps) {
  const session = useSession();
  const [
    { shipmentCount },
    { usersCount },
    { usersCount: userCountRejected },
    { usersCount: userCountAccepted },
    { usersCount: userCountPending },
  ] = kpiData;
  if (!session.data?.user.role) {
    return "Loading";
    // (
    //   <>
    //     <div className="flex flex-col space-y-3">
    //       <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    //       <div className="space-y-2">
    //         <Skeleton className="h-4 w-[250px]" />
    //         <Skeleton className="h-4 w-[200px]" />
    //       </div>
    //     </div>
    //   </>
    // );
  }
  return (
    <>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4  md:gap-8 ">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Shipments
              </CardTitle>
              <PackageIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shipmentCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <TruckIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Rejected Users
              </CardTitle>
              <TruckIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCountRejected}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Accepted Users
              </CardTitle>
              <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCountAccepted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Users
              </CardTitle>
              <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCountPending}</div>
            </CardContent>
          </Card>
        </div>
        <div className={`grid gap-4 md:grid-cols-2`}>
          <Card>
            <CardHeader>
              <CardTitle>Shipment Volumes</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData ? (
                <BarChart className={"aspect-[9/4]"} data={chartData} />
              ) : (
                <p className="text-lg">No Data to Show</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Number of Shipments per Status</CardTitle>
            </CardHeader>
            <CardContent>
              {adminData ? (
                <BarChart className={"aspect-[9/4]"} data={adminData} />
              ) : (
                <p className="text-lg">No Data to Show</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
