"use client";

import { useCurrentUser } from "@/services/auth.mutations";
import {
  GetAllShipmentsInputType,
  Shipment,
  ShipmentStatus,
  TrackWithType,
  useGetShipments,
} from "@/services/shipment.queries";
import { PermissionsType } from "@/types/user.types";
import { checkPermissions } from "@/utils/user.utils";
import { useSearchParams } from "next/navigation";
import Filter, { OptionsMapperType } from "../Filter";
import SearchBar from "../SearchBar";
import AllShipmentCreationDropDown from "../all-shipment-creation-dropdown";
import { columns } from "../tables/shipment-table/columns";
import { ShipmentTable } from "../tables/shipment-table/shipment-table";
import { ScrollArea } from "../ui/scroll-area";
import { useGetCompanies } from "@/services/companies.queries";

const ShipmentPage = () => {
  const searchParams = useSearchParams();

  const params: GetAllShipmentsInputType = {
    searchString: (searchParams.get("search") as string) || "",
    limitParam: Number(searchParams.get("limit")) || 10,
    pageParam: Number(searchParams.get("page")) || 1,
    tags: Array.isArray(searchParams.getAll("tags"))
      ? searchParams.getAll("tags")
      : undefined,
    trackWith: searchParams.get("trackWith")
      ? (String(searchParams.get("trackWith")) as TrackWithType)
      : undefined,
    status: searchParams.get("status")
      ? (String(searchParams.get("status")) as ShipmentStatus)
      : undefined,
    companyId: searchParams.get("companyId")
      ? Number(searchParams.get("companyId"))
      : undefined,
  };

  const { data: result, isLoading } = useGetShipments(params);
  const { data: user } = useCurrentUser();
  const { data: companies } = useGetCompanies(
    {},
    { enabled: user?.user.role === "SUPER_ADMIN" },
  );

  const optionsMapper: OptionsMapperType["Shipment"] = {
    status: [
      { label: "Delivered", value: "DELIVERED" },
      { label: "In Transit", value: "IN_TRANSIT" },
      { label: "Planned", value: "PLANNED" },
      { label: "Unknown", value: "UNKNOWN" },
    ],
    trackWith: [
      { label: "Container Number", value: "CONTAINER_NUMBER" },
      { label: "Booking or Lading Number", value: "MBL_NUMBER" },
    ],
    companyId: companies?.results
      ? companies.results.map((company) => ({
          label: String(company.name),
          value: company.id,
        }))
      : undefined,
  };

  return (
    <ScrollArea className="h-full ">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col ">
          <h1 className="text-lg font-bold tracking-tight">Shipment List</h1>
          <div className="  flex justify-between">
            <p className="text-sm tracking-tight">
              You can create, view and edit all shipments from the table below.
            </p>
          </div>
          <div className="mt-4">
            <SearchBar placeholder="type anything to search ..." />
          </div>
          <div className="flex justify-between mb-4 mt-4">
            {(user?.user.role === "SUPER_ADMIN" ||
              checkPermissions(user?.user.permissions as PermissionsType[], [
                "CREATE_SHIPMENT",
              ])) && <AllShipmentCreationDropDown />}
            {/* <Button
              onClick={async () =>
                await handleExportProduct((result?.results || []) as Shipment[])
              }
              className="flex gap-3 border rounded-md px-4 py-2 bg-[#78c350] text-white hover:bg-[#69ab46]"
            >
              <File className="w-4 h-4" /> Export to Excel{" "}
              <span className="rounded-md bg-white text-black w-4 h-4 text-xs font-bold">
                {result?.results.length}
              </span>
            </Button> */}
            <Filter
              optionsMapper={optionsMapper}
              type="Shipment"
              defaultValue={"trackWith"}
            />
          </div>

          {isLoading ? (
            <>Loading...</>
          ) : (
            <>
              <ShipmentTable
                data={(result?.results || []) as Shipment[]}
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
