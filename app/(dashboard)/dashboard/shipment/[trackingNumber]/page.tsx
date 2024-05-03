import { getShipmentByTrackingNumber } from "@/actions/shipmentActions";
import { ChevronLeftIcon } from "@/components/Icons/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth-options";
import { ROLE, ShipmentData } from "@/types";
import Link from "next/link";

type PageProps = {
  params: { trackingNumber: string };
};
export default async function Component(props: PageProps) {
  const { params } = props;
  const session = await auth();
  const shipData: ShipmentData = (await getShipmentByTrackingNumber(
    params.trackingNumber as string,
  )) as ShipmentData;
  if (!params.trackingNumber) {
    return null;
  }


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
        <h1 className="text-lg font-semibold md:text-2xl">Shipment Details</h1>
      </div>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Number</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {shipData?.tracking_number}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Delivery Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {shipData?.arrivalTime}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{shipData.status}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Carrier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{shipData.carrier}</div>
            </CardContent>
          </Card>
        </div>
        {session?.user.role === ROLE.ADMIN && (
          <>
            <div className="flex items-center h-14 border-b px-4 md:h-16 bg-gray-100/40 dark:bg-gray-800/40 mt-2 mb-2">
              <h1 className="text-lg font-semibold md:text-2xl">
                User Details
              </h1>
              <div className="ml-auto flex items-center gap-2 md:gap-4"></div>
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Id: {shipData?.user?.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <div className="text-gray-500 dark:text-gray-400">
                        Name:
                      </div>
                      <div className="font-semibold">
                        {shipData?.user?.name}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-gray-500 dark:text-gray-400">
                        Email:
                      </div>
                      <div className="font-semibold">
                        {shipData?.user?.email}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {shipData.vessels.length && (
          <>
            <div className="flex items-center h-14 border-b px-4 md:h-16 bg-gray-100/40 dark:bg-gray-800/40 mt-2 mb-2">
              <h1 className="text-lg font-semibold md:text-2xl">
                Vessel Details
              </h1>
              <div className="ml-auto flex items-center gap-2 md:gap-4"></div>
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {shipData?.vessels?.map((vessel, index) => {
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>Vessel Id: {vessel.fid}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <div className="text-gray-500 dark:text-gray-400">
                            Name:
                          </div>
                          <div className="font-semibold">{vessel.name}</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-gray-500 dark:text-gray-400">
                            Flag:
                          </div>
                          <div className="font-semibold">{vessel.flag}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
