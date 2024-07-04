"use client";

import { useGetShipments } from "@/services/shipment.queries";
import { useSearchParams } from "next/navigation";
import SearchBar from "../SearchBar";
import ShipmentCreationForm from "../forms/shipment-creation-form";
import { columns } from "../tables/shipment-table/columns";
import { ShipmentTable } from "../tables/shipment-table/shipment-table";
import { checkPermissions } from "@/utils/user.utils";
import { useCurrentUser } from "@/services/auth.mutations";
import { UserPermissions } from "@/types/services/auth.types";

const ShipmentPage = () => {
  const searchParams = useSearchParams();

  const params = {
    searchString: (searchParams.get("search") as string) || "",
    limitParam: 9,
    pageParam: Number(searchParams.get("page")) || 1,
  };

  const { data: result } = useGetShipments(params);
  const { data: user } = useCurrentUser();

  return (
    <div className="flex flex-col ">
      <h1 className="text-lg font-bold tracking-tight">List of shipment</h1>
      <div className="  flex justify-between">
        <p className="text-sm tracking-tight">
          You can create, view and edit all shipments from the table below.
        </p>
        <SearchBar />
      </div>
      {checkPermissions(user?.user.permissions as UserPermissions[], [
        "CREATE_SHIPMENT",
      ]) && (
        <div className="flex my-5 justify-between">
          <ShipmentCreationForm />
        </div>
      )}
      {Array.isArray(result?.results) ? (
        <>
          <ShipmentTable
            data={result?.results}
            columns={columns}
            pageCount={result.paginatorInfo.pages}
          />
        </>
      ) : (
        <h1>No Records</h1>
      )}
    </div>
  );
};

export default ShipmentPage;
