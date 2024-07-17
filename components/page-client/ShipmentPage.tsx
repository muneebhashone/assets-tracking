"use client";

import { useCurrentUser } from "@/services/auth.mutations";
import {
  GetAllShipmentsInputType,
  Shipment,
  TrackWithType,
  useGetShipments,
} from "@/services/shipment.queries";
import { PermissionsType } from "@/types/user.types";
import { checkPermissions } from "@/utils/user.utils";
import { useSearchParams } from "next/navigation";
import SearchBar from "../SearchBar";
import ShipmentCreationForm from "../forms/shipment-creation-form";
import { columns } from "../tables/shipment-table/columns";
import { ShipmentTable } from "../tables/shipment-table/shipment-table";
import { ScrollArea } from "../ui/scroll-area";

const ShipmentPage = () => {
  const searchParams = useSearchParams();

  const params: GetAllShipmentsInputType = {
    searchString: (searchParams.get("search") as string) || "",
    limitParam: 9,
    pageParam: Number(searchParams.get("page")) || 1,
    tags: Array.isArray(searchParams.getAll("tags"))
      ? searchParams.getAll("tags")
      : undefined,
    trackWith: searchParams.get("trackWith")
      ? (String(searchParams.get("trackWith")) as TrackWithType)
      : undefined,
  };

  const { data: result } = useGetShipments(params);
  const { data: user } = useCurrentUser();
  // const optionsMapper: OptionsMapperType["Shipment"] = {
  //   tags: null,
  //   trackWith: ["CONTAINER_NUMBER", "MBL_NUMBER"],
  // };

  return (
    <ScrollArea className="h-full ">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col ">
          <h1 className="text-lg font-bold tracking-tight">List of shipment</h1>
          <div className="  flex justify-between">
            <p className="text-sm tracking-tight">
              You can create, view and edit all shipments from the table below.
            </p>
          </div>

          {(user?.user.role === "SUPER_ADMIN" ||
            checkPermissions(user?.user.permissions as PermissionsType[], [
              "CREATE_SHIPMENT",
            ])) && (
            <div className="flex my-5 justify-between">
              <ShipmentCreationForm />
            </div>
          )}
          <div className="flex justify-between mb-2">
            <SearchBar />
            {/* <Filter
              optionsMapper={optionsMapper}
              type="Shipment"
              defaultValue={"trackWith"}
            /> */}
          </div>

          {Boolean(result?.results?.length) && (
            <>
              <ShipmentTable
                data={result?.results as Shipment[]}
                columns={columns}
                pageCount={result?.paginatorInfo.pages as number}
              />
            </>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ShipmentPage;
