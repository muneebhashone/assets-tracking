import { ChevronLeftIcon } from "@/components/Icons/index";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PageProps = {
  params: { trackingNumber: string };
};
export default async function Component(props: PageProps) {
  const { params } = props;
  // const session = await auth();
  // const shipData: ShipmentData = (await getShipmentByTrackingNumber(
  //   params.trackingNumber as string,
  // )) as ShipmentData;
  // if (!params.trackingNumber) {
  //   return null;
  // }

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
          Shipment # {"Shipment Number"}
        </h1>
      </div>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 text-gray-700">
              <div className="flex">
                <span className="font-semibold">Reference :</span>
                <span className="ml-2">-</span>
              </div>
              <div className="flex ">
                <span className="font-semibold">Status :</span>

                <span className="ml-2 bg-[#ff9800] text-white px-2 py-1 rounded-sm text-sm">
                  New
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold">Booking / MBL :</span>
                <span className="ml-2">CMA CGM</span>
              </div>

              <div className="flex ">
                <span className="font-semibold">Container :</span>
                <span className="ml-2">ASDASDASDVCSADSAD </span>
              </div>
              <div className="flex ">
                <span className="font-semibold">Creator :</span>
                <div>
                  <p className="ml-2">12/06/2024 18:58:54</p>
                  <p className="ml-2">John Doe &lt;Joan.doe@gmail.com&gt; </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Number</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Delivery Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Carrier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold"></div>
            </CardContent>
          </Card>
        </div> */}
        {/* {session?.user.role === ROLE.SUPER_ADMIN && (
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
        )} */}

        {/* {shipData.vessels.length > 0 && (
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
        )} */}
      </main>
    </div>
  );
}
