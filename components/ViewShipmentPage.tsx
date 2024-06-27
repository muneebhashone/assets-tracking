"use client";

import { useGetSharedShipment } from "@/services/shipment.queries";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "./ui/button";

import { ShipmentStatusDisplay, TrackWithDisplay } from "@/utils/constants";
import { ChevronLeftIcon, MailCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import UploadedFilesView from "./UploadedFilesView";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { toast } from "./ui/use-toast";

const ViewShipmentPage = ({ token }: { token: string }) => {
  const { data, isLoading } = useGetSharedShipment({ token });
  const { push } = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (data?.data.shareToken !== token) {
        toast({
          description: "Invalid Shipment Token",
          variant: "destructive",
        });
        setTimeout(() => {
          push("/");
        }, 100);
      }
    }
  }, [isLoading]);

  return (
    <div className="h-[100%] overflow-y-scroll">
      <div className="flex items-center h-14 border-b px-4 md:h-16 bg-gray-100/40 dark:bg-gray-800/40">
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
            `Shipment # ${data?.data.id}`
          )}
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 text-gray-700">
              <div className="flex">
                <span className="font-semibold">Reference :</span>
                <span className="ml-2">
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2" />
                  ) : data?.data.referenceNo ? (
                    data?.data.referenceNo
                  ) : (
                    "-"
                  )}
                </span>
              </div>
              <div className="flex ">
                <span className="font-semibold">Status :</span>{" "}
                {isLoading ? (
                  <Skeleton className="h-6 w-[100px]  py-2 ms-2" />
                ) : data?.data.status ? (
                  <Badge className="bg-[#ff9800]  ms-2">
                    {ShipmentStatusDisplay[data?.data.status]}
                  </Badge>
                ) : (
                  <span className="ms-2">{"-"}</span>
                )}
              </div>
              <div className="flex">
                <span className="font-semibold">Carrier :</span>
                <span className="ml-2">
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2" />
                  ) : data?.data.carrier ? (
                    data?.data.carrier
                  ) : (
                    "-"
                  )}
                </span>
              </div>

              {data?.data.trackWith === "CONTAINER_NUMBER" ? (
                <div className="flex ">
                  <span className="font-semibold">Container Number:</span>
                  <span className="ml-2">
                    {" "}
                    {isLoading ? (
                      <Skeleton className="h-6 w-[100px]  py-2" />
                    ) : data?.data.containerNo ? (
                      data?.data.containerNo
                    ) : (
                      "-"
                    )}{" "}
                  </span>
                </div>
              ) : (
                <div className="flex ">
                  <span className="font-semibold">
                    Master Bill Of Lading Number:
                  </span>
                  <span className="ml-2">
                    {" "}
                    {isLoading ? (
                      <Skeleton className="h-6 w-[100px]  py-2" />
                    ) : data?.data.containerNo ? (
                      data?.data.containerNo
                    ) : (
                      "-"
                    )}{" "}
                  </span>
                </div>
              )}
              <div className="flex ">
                <span className="font-semibold">Created At :</span>
                <div>
                  <p className="ml-2">
                    {isLoading ? (
                      <Skeleton className="h-6 w-[100px]  py-2" />
                    ) : data?.data.createdAt ? (
                      data?.data.createdAt
                    ) : (
                      "-"
                    )}
                  </p>
                  {/* <p className="ml-2">John Doe &lt;Joan.doe@gmail.com&gt; </p> */}
                </div>
              </div>
              <div className="flex ">
                <span className="font-semibold">Arrival Time:</span>
                <div>
                  <p className="ml-2">
                    {isLoading ? (
                      <Skeleton className="h-6 w-[100px]  py-2" />
                    ) : data?.data.arrivalTime ? (
                      data?.data.arrivalTime
                    ) : (
                      "-"
                    )}
                  </p>
                  {/* <p className="ml-2">John Doe &lt;Joan.doe@gmail.com&gt; </p> */}
                </div>
              </div>
              <div className="flex ">
                <span className="font-semibold">Tracking With:</span>
                <div>
                  <p className="ml-2">
                    {isLoading ? (
                      <Skeleton className="h-6 w-[100px]  py-2 ms-2" />
                    ) : data?.data.trackWith ? (
                      TrackWithDisplay[data?.data.trackWith]
                    ) : (
                      <span className="ms-2">{"-"}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex ">
                <span className="font-semibold">Is Tracking:</span>
                <div>
                  <p className="ml-2">
                    {isLoading ? (
                      <Skeleton className="h-6 w-[100px]  py-2 ms-2" />
                    ) : (
                      String(data?.data.isTracking)
                    )}
                  </p>
                </div>
              </div>
              <div className="flex ">
                <span className="font-semibold">Type:</span>
                <span className="ml-2">
                  {" "}
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2" />
                  ) : data?.data.type ? (
                    data?.data.type
                  ) : (
                    "-"
                  )}{" "}
                </span>
              </div>
              <div className="flex ">
                <span className="font-semibold">Progress:</span>
                <span className="ml-2">
                  {" "}
                  {isLoading ? (
                    <Skeleton className="h-6 w-[100px]  py-2" />
                  ) : data?.data.progress ? (
                    data?.data.progress
                  ) : (
                    "-"
                  )}{" "}
                </span>
              </div>
              <div className="flex ">
                <span className="font-semibold">Tags :</span>{" "}
                {isLoading ? (
                  <Skeleton className="h-6 w-[100px]  py-2 ms-2" />
                ) : data?.data.tags.length ? (
                  data?.data?.tags?.map((tag) => {
                    return <Badge className="bg-green-600  ms-2">{tag}</Badge>;
                  })
                ) : (
                  <span className="ms-2">{"-"}</span>
                )}
              </div>
              {data?.data.shareFiles && data?.data?.files?.length && (
                <div className="flex ">
                  <span className="font-semibold">View Files : </span>
                  <div>
                    <p className="ml-2">
                      <UploadedFilesView data={data.data} />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {Boolean(data?.data?.followers.length) && (
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <div className="flex items-start ">
                <span className="font-semibold me-4 mt-2">Followers : </span>

                <div>
                  {data?.data?.followers.length &&
                    data?.data?.followers?.map((value) => {
                      return (
                        <div className="relative mb-3">
                          <Input
                            type="text"
                            value={value}
                            disabled
                            className="md:w-[600px] h-[60px] px-16 text-[#A8A8A8] border border-[#A8A8A8]"
                          />
                          <div className="absolute left-0 top-0 flex items-center justify-center h-full px-3 ">
                            <MailCheckIcon />
                            <div className="w-[2px] h-10 bg-[#A8A8A8] ml-2"></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ViewShipmentPage;
