"use client";

import { ChevronLeftIcon } from "@/components/Icons/index";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shipment, useGetShipmentById } from "@/services/shipment.queries";
import { MapPin } from "lucide-react";
import moment from "moment";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import ShipmentDetailExtraForm from "../forms/shipment-details-extra-form";
import { Skeleton } from "../ui/skeleton";
import ShipmentContainer from "./ShipmentContainer";
import ShipmentMovement from "./ShipmentMovement";

const LazyMap = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
type ShipmentDetailPageProps = {
  id: string;
};

const ShipmentDetailPage = ({ id }: ShipmentDetailPageProps) => {
  const [tab, setTab] = useState("movements");
  const { data: shipmentData, isFetching } = useGetShipmentById({
    shipmentId: Number(id),
  });

  // const DEFAULT_CENTER = [38.907132, -77.036546];
  return (
    <div className="h-[100%] overflow-y-scroll">
      <div className="flex items-center h-14 border-b px-4 md:h-16 ">
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
        <h1 className="text-lg font-semibold md:text-2xl">
          Shipment # {shipmentData?.result.id ? shipmentData?.result.id : "NA"}
        </h1>
      </div>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 text-gray-700">
              <div className="flex">
                <span className="font-semibold">Reference :</span>
                <span className="ml-2 text-gray-500">
                  {shipmentData?.result.referenceNo
                    ? shipmentData?.result.referenceNo
                    : "NA"}
                </span>
              </div>
              <div className="flex  gap-2">
                <span className="font-semibold">Status :</span>
                <Badge className="bg-golden">
                  {shipmentData?.result.status
                    ? shipmentData?.result.status
                    : "New"}
                </Badge>
              </div>
              <div className="flex">
                <span className="font-semibold">Booking / MBL :</span>
                <span className="ml-2 text-gray-500">
                  {" "}
                  {shipmentData?.result.mblNo
                    ? shipmentData?.result.mblNo
                    : "NA"}
                </span>
              </div>

              <div className="flex ">
                <span className="font-semibold text-gray-500">Container :</span>
                <span className="ml-2 text-gray-500">
                  {" "}
                  {shipmentData?.result.containerNo
                    ? shipmentData?.result.containerNo
                    : "NA"}{" "}
                </span>
              </div>
              <div className="flex ">
                <span className="font-semibold">Creator :</span>
                <div>
                  <p className="ml-2 text-gray-500">
                    {" "}
                    {shipmentData?.result.createdAt
                      ? moment(shipmentData?.result.createdAt).format(
                          "MM/DD/YYYY HH:mm:ss",
                        )
                      : "NA"}
                  </p>
                  <p className="ml-2 text-gray-500">
                    {shipmentData?.result.user.name
                      ? shipmentData?.result.user.name
                      : "NA"}{" "}
                    &lt;
                    {shipmentData?.result.user.email
                      ? shipmentData?.result.user.email
                      : "NA"}
                    &gt;{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 items-center mb-4">
          <Button
            size="lg"
            variant={"outline"}
            className=" border-golden rounded-none hover:bg-golden hover:text-white  text-golden gap-2"
            onClick={() => setTab("live_location")}
          >
            {" "}
            <MapPin className="w-4 h-4   " />
            Live Position
          </Button>
          {/* <Button
            className="rounded-full border w-8 h-8"
            size="icon"
            variant="ghost"
          >
            <span className="sr-only">Hamburger</span>
            <HamburgerMenuIcon />
          </Button> */}
        </div>
        <div className="flex ">
          <Tabs
            className="w-full  "
            value={tab}
            onValueChange={(value) => setTab(value)}
          >
            <TabsList className="grid w-full grid-cols-3   bg-transparent">
              <TabsTrigger
                value="movements"
                className=" w-full border-b-2  rounded-none data-[state=active]:border-[#3491fe] text-black font-semibold text-sm "
              >
                {" "}
                Movements
              </TabsTrigger>
              <TabsTrigger
                value="containers"
                className=" w-full border-b-2  rounded-none data-[state=active]:border-[#3491fe] text-black font-semibold text-sm "
              >
                Containers
              </TabsTrigger>
              <TabsTrigger
                value="extras"
                className=" w-full border-b-2  rounded-none data-[state=active]:border-[#3491fe] text-black font-semibold text-sm "
              >
                Extras
              </TabsTrigger>
            </TabsList>
            <TabsContent value="movements">
              <ShipmentMovement />
            </TabsContent>
            <TabsContent value="containers">
              <ShipmentContainer />
            </TabsContent>
            <TabsContent value="extras">
              {!isFetching ? (
                <ShipmentDetailExtraForm
                  shipmentData={shipmentData?.result as Shipment}
                  shipmentField="tags"
                  placeHolder="Enter Tags here..."
                />
              ) : (
                <Skeleton className="h-6 w-full mb-4 py-2" />
              )}
              {!isFetching ? (
                <ShipmentDetailExtraForm
                  shipmentData={shipmentData?.result as Shipment}
                  shipmentField="followers"
                  placeHolder="Enter Followers here..."
                />
              ) : (
                <Skeleton className="h-6 w-full mb-4 py-2" />
              )}
            </TabsContent>
            <TabsContent value="live_location">
              <LazyMap width={"100%"} height={"600px"} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ShipmentDetailPage;