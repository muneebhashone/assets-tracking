"use client";

import { ChevronLeftIcon } from "@/components/Icons/index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type ShipmentStatus,
  type ShipmentWithContainerAndMovements,
  useGetShipmentById,
} from "@/services/shipment.queries";
import { MapPin } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import ShipmentDetailExtraForm from "../forms/shipment-details-extra-form";
import { GoogleMap } from "../google-map/map";
import { Skeleton } from "../ui/skeleton";
import ShipmentContainer from "./ShipmentContainer";
import ShipmentMovement from "./ShipmentMovement";
import { StatusBadgeColor } from "@/utils/constants";
import { LabeledButton } from "../labelled-button";
import { useShipmentKPIs } from "@/hooks/useShipmentKPIs";

type ShipmentDetailPageProps = {
  id: string;
};

const ShipmentDetailPage = ({ id }: ShipmentDetailPageProps) => {
  const [tab, setTab] = useState("movements");
  const { data: shipmentData, isFetching } = useGetShipmentById({
    shipmentId: Number(id),
  });
  const { kpis, isLoading: kpisLoading } = useShipmentKPIs(Number(id));

  return (
    <div className="h-[100%] overflow-y-scroll">
      <div className="flex items-center justify-between border-b px-4 ">
        <Link href={"/dashboard/shipment-list"}>
          <Button
            className="rounded-full border w-8 h-8"
            size="icon"
            variant="ghost"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold md:text-lg">
          Shipment # {shipmentData?.result.id ? shipmentData?.result.id : "-"}
        </h1>
        <div className="flex justify-end gap-2 mt-2 items-center mb-2">
          {Boolean(shipmentData?.result?.currentLocation) && (
            <LabeledButton
              label={
                !shipmentData?.result?.movements?.length ||
                !shipmentData.result.containers.length
                  ? "The Shipment Data is not Available therefore the Live Location cannot be shown"
                  : "Live Location"
              }
              size="sm"
              variant={"outline"}
              className="border-golden rounded-none hover:bg-golden hover:text-white text-golden gap-2"
              onClick={() => setTab("live_location")}
              disabled={
                !shipmentData?.result?.movements?.length ||
                !shipmentData.result.containers.length
              }
            >
              <MapPin className="w-4 h-4" />
              Live Position
            </LabeledButton>
          )}
        </div>
      </div>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-2 mb-2 text-gray-700 text-xs">
              <div className="flex items-center">
                <span className="font-semibold text-xs min-w-[80px]">
                  Reference:
                </span>
                <span className="text-gray-500 truncate">
                  {shipmentData?.result.referenceNo || "-"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-xs min-w-[80px]">
                  Status:
                </span>
                <Badge
                  className={`text-center tracking-tighter text-white text-xs px-1.5 py-0.5 bg-${
                    StatusBadgeColor[
                      shipmentData?.result.status as ShipmentStatus
                    ]?.color ?? "gray-700"
                  }`}
                >
                  {shipmentData?.result.status
                    ? StatusBadgeColor[shipmentData?.result.status]?.value
                    : "-"}
                </Badge>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-xs min-w-[80px]">
                  Carrier:
                </span>
                <span className="text-gray-500 truncate">
                  {shipmentData?.result.carrier || "-"}
                </span>
              </div>
              {shipmentData?.result.mblNo && (
                <div className="flex items-center">
                  <span className="font-semibold text-xs min-w-[80px]">
                    Booking/MBL:
                  </span>
                  <span className="text-gray-500 truncate">
                    {shipmentData?.result.mblNo || "-"}
                  </span>
                </div>
              )}
              {shipmentData?.result.containerNo && (
                <div className="flex items-center">
                  <span className="font-semibold text-xs min-w-[80px]">
                    Container:
                  </span>
                  <span className="text-gray-500 truncate">
                    {shipmentData?.result.containerNo || "-"}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <span className="font-semibold text-xs min-w-[80px]">
                  Creator:
                </span>
                <span className="text-gray-500 truncate">
                  {shipmentData?.result.user?.name || "-"} (
                  {moment(shipmentData?.result.createdAt).format("DD/MM/YY")})
                </span>
              </div>
            </div>

            <div className="border-t pt-2">
              <div className="text-xs font-semibold text-gray-700 mb-1">
                KPIs (days)
              </div>
              {kpisLoading ? (
                <div className="grid grid-cols-5 gap-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : !kpis ? (
                <div className="text-xs text-gray-500">
                  KPI data not available
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  <KPICard
                    title="Port to Port"
                    value={kpis.portToPort ? [kpis.portToPort] : null}
                  />
                  <KPICard title="Door to Door" value={kpis.doorToDoor} />
                  <KPICard
                    title="Empty → Gate Out"
                    value={kpis.emptyToShipperToGateOut}
                  />
                  <KPICard
                    title="Empty → Delivery"
                    value={kpis.emptyToShipperToDelivery}
                  />
                  <KPICard
                    title="Gate Out → Return"
                    value={kpis.gateOutToEmptyReturn}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex">
          <Tabs
            className="w-full"
            value={tab}
            onValueChange={(value) => setTab(value)}
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent">
              <TabsTrigger
                value="movements"
                className="w-full border-b-2 rounded-none data-[state=active]:border-[#3491fe] data-[state=active]:shadow-none text-black font-semibold text-sm"
              >
                Milestones
              </TabsTrigger>
              <TabsTrigger
                value="containers"
                className="w-full border-b-2 rounded-none data-[state=active]:border-[#3491fe] data-[state=active]:shadow-none text-black font-semibold text-sm"
              >
                Equipments
              </TabsTrigger>
              <TabsTrigger
                value="extras"
                className="w-full border-b-2 rounded-none data-[state=active]:border-[#3491fe] data-[state=active]:shadow-none text-black font-semibold text-sm"
              >
                Doodads
              </TabsTrigger>
            </TabsList>
            <TabsContent value="movements">
              <ShipmentMovement shipmentId={Number(id)} />
            </TabsContent>
            <TabsContent value="containers">
              <ShipmentContainer shipmentId={Number(id)} />
            </TabsContent>
            <TabsContent value="extras">
              {!isFetching ? (
                <ShipmentDetailExtraForm
                  shipmentData={
                    shipmentData?.result as ShipmentWithContainerAndMovements
                  }
                  shipmentField="followers"
                  showBar={true}
                  placeHolder="Enter Followers here..."
                />
              ) : (
                <Skeleton className="h-6 w-full mb-4 py-2" />
              )}
              {!isFetching ? (
                <ShipmentDetailExtraForm
                  shipmentData={
                    shipmentData?.result as ShipmentWithContainerAndMovements
                  }
                  shipmentField="tags"
                  placeHolder="Enter Tags here..."
                />
              ) : (
                <Skeleton className="h-6 w-full mb-4 py-2" />
              )}
            </TabsContent>
            <TabsContent value="live_location">
              <GoogleMap shipmentId={Number(id)} className="h-[500px] w-full" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: number[] | null;
}

const KPICard = ({ title, value }: KPICardProps) => {
  return (
    <div className="bg-white p-1.5 rounded shadow-sm border">
      <div className="text-xs font-medium text-gray-500 truncate">{title}</div>
      <div className="text-sm font-semibold">
        {value !== null && value.length > 0 ? value.join(", ") : "-"}
      </div>
    </div>
  );
};

export default ShipmentDetailPage;
