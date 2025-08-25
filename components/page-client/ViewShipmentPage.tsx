"use client";

import { cn } from "@/lib/utils";
import { useGetSharedShipment } from "@/services/shipment.queries";
import {
  ShipmentStatusDisplay,
  StatusBadgeColor,
  TrackWithDisplay,
} from "@/utils/constants";
import { ChevronLeftIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import UploadedFilesView from "../UploadedFilesView";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import ShipmentMovement from "./ShipmentMovement";

const ViewShipmentPage = ({ token }: { token: string }) => {
  const { data: shipment, isLoading } = useGetSharedShipment({ token });
  const data = shipment?.data;

  return (
    <div className="h-screen overflow-y-scroll">
      {/* Header */}
      <div className="flex items-center gap-4 h-14 border-b px-4 md:h-16 bg-gray-100/40 ">
        <Link href={"/dashboard"}>
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
          {isLoading ? (
            <Skeleton className="h-8 w-[200px]  py-2" />
          ) : (
            `Shipment # ${data?.id}`
          )}
        </h1>
      </div>

      {/* Shipment Details */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 text-gray-700">
              {/* Reference */}
              <div className="flex">
                <span className="font-semibold">Reference:</span>
                <span className="ml-2">
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2" />
                  ) : data?.referenceNo ? (
                    data?.referenceNo
                  ) : (
                    "-"
                  )}
                </span>
              </div>

              {/* Status */}
              <div className="flex ">
                <span className="font-semibold">Status:</span>{" "}
                {isLoading ? (
                  <Skeleton className="h-6 w-[100px]  py-2 ms-2" />
                ) : data?.status ? (
                  <Badge
                    className={cn(
                      "gray-700 ms-2",
                      StatusBadgeColor[data?.status]?.color &&
                        "bg-" + StatusBadgeColor[data?.status]?.color,
                    )}
                  >
                    {ShipmentStatusDisplay[data?.status]}
                  </Badge>
                ) : (
                  <span className="ms-2">{"-"}</span>
                )}
              </div>

              {/* Carrier */}
              <div className="flex">
                <span className="font-semibold">Carrier :</span>
                <span className="ml-2">
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2" />
                  ) : data?.carrier ? (
                    <>
                      {data?.carrier}
                      {data?.sealine && ` (${data?.sealine})`}
                    </>
                  ) : (
                    "-"
                  )}
                </span>
              </div>

              {/* Container / MBL Number */}
              <div className="flex">
                {data?.trackWith === "CONTAINER_NUMBER" ? (
                  <>
                    <span className="font-semibold">Container Number:</span>
                    <span className="ml-2">
                      {" "}
                      {isLoading ? (
                        <Skeleton className="h-6 w-[100px]  py-2" />
                      ) : data?.containerNo ? (
                        data?.containerNo
                      ) : (
                        "-"
                      )}{" "}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">
                      Master Bill Of Lading Number:
                    </span>
                    <span className="ml-2">
                      {" "}
                      {isLoading ? (
                        <Skeleton className="h-6 w-[100px]  py-2" />
                      ) : data?.containerNo ? (
                        data?.containerNo
                      ) : (
                        "-"
                      )}{" "}
                    </span>
                  </>
                )}
              </div>

              {/* Port of Loading */}
              <div className="flex ">
                <span className="font-semibold">Port of Loading:</span>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2" />
                  ) : (
                    <p className="ml-2">
                      {data?.pol ? (
                        <>
                          {data?.pol.location.name} (
                          {moment(data.pol.date).format("DD/MM/YYYY")})
                        </>
                      ) : (
                        "-"
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Port of Destination */}
              <div className="flex ">
                <span className="font-semibold">Port of Destination:</span>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2" />
                  ) : (
                    <p className="ml-2">
                      {data?.pod ? (
                        <>
                          {data?.pod.location.name} (
                          {moment(data.pod.date).format("DD/MM/YYYY")})
                        </>
                      ) : (
                        "-"
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Created At */}
              <div className="flex ">
                <span className="font-semibold">Created At:</span>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2" />
                  ) : (
                    <p className="ml-2">
                      {data?.createdAt
                        ? moment(data?.createdAt).format("DD/MM/YYYY")
                        : "-"}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Date */}
              <div className="flex ">
                <span className="font-semibold">Delivery Date:</span>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2" />
                  ) : (
                    <p className="ml-2">
                      {data?.arrivalTime ? data?.arrivalTime : "-"}
                    </p>
                  )}
                </div>
              </div>

              {/* Tracking With */}
              <div className="flex ">
                <span className="font-semibold">Tracking With:</span>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2 ms-2" />
                  ) : (
                    <p className="ml-2">
                      {data?.trackWith
                        ? TrackWithDisplay[data?.trackWith]
                        : "-"}
                    </p>
                  )}
                </div>
              </div>

              {/* Type */}
              <div className="flex ">
                <span className="font-semibold">Type:</span>
                <span className="ml-2">
                  {" "}
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2" />
                  ) : data?.type ? (
                    data?.type
                  ) : (
                    "-"
                  )}{" "}
                </span>
              </div>

              {/* Tags */}
              <div className="flex ">
                <span className="font-semibold">Tags:</span>{" "}
                {isLoading ? (
                  <Skeleton className="h-6 w-[100px]  py-2 ms-2" />
                ) : data?.tags?.length ? (
                  data?.tags?.map((tag, index) => {
                    return (
                      <Badge className="bg-green-600  ms-2" key={index}>
                        {tag}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="ms-2">-</span>
                )}
              </div>

              {/* View Files */}
              {data?.shareFiles && data?.files?.length && (
                <div className="flex ">
                  <span className="font-semibold">View Files : </span>
                  <div>
                    <p className="ml-2">
                      <UploadedFilesView data={data} />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Movements */}
      {data && (
        <div className="p-4 space-y-2 pb-24">
          <span className="font-semibold me-4 mt-2 text-lg text-gray-700">
            Milestones:{" "}
          </span>
          <ShipmentMovement shipmentId={data?.id} />
        </div>
      )}
    </div>
  );
};
export default ViewShipmentPage;
