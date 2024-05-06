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
  chartData: readonly BarDatum[];
  kpiData: IKpiData["userKpi"];
}
export default function UserDashboardView({
  chartData,
  kpiData,
}: DashboardProps) {
  const session = useSession();
  const [
    { shipmentCount },
    { shipmentCount: planned },
    { shipmentCount: unknown },
    { shipmentCount: delivered },
    { shipmentCount: in_transit },
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
              <CardTitle className="text-sm font-medium">
                Delivered Shipments
              </CardTitle>
              <TruckIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{delivered}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Unknown Shipments
              </CardTitle>
              <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unknown}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Planned Shipments
              </CardTitle>
              <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{planned}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Shipments In Transit
              </CardTitle>
              <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{in_transit}</div>
            </CardContent>
          </Card>
        </div>
        <div className={`grid gap-4 md:grid-cols-1`}>
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
        </div>
      </main>
    </>
  );
}
