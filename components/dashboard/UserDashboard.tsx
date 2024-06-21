"use client";

import { useGetShipments } from "@/services/shipment.queries";
import { useSearchParams } from "next/navigation";
import SearchBar from "../SearchBar";
import ShipmentCreationForm from "../forms/shipment-creation-form";
import { columns } from "../tables/shipment-table/columns";
import { ShipmentTable } from "../tables/shipment-table/shipment-table";

const UserDashboard = () => {
  const searchParams = useSearchParams();

  const params = {
    searchString: (searchParams.get("search") as string) || "",
    limitParam: 9,
    pageParam: Number(searchParams.get("page")) || 1,
  };

  const { data: result } = useGetShipments(params);

  return (
    <div className="flex flex-col ">
      <h1 className="text-lg font-bold tracking-tight">List of shipment</h1>
      <div className="  flex justify-between">
        <p className="text-sm tracking-tight">
          You can create, view and edit all shipments from the table below.
        </p>
        <SearchBar />
      </div>
      <div className="flex my-5 justify-between">
        <ShipmentCreationForm />
        {/* <Button variant="default">Export as pdf</Button> */}
      </div>
      {Array.isArray(result?.results) ? (
        <>
          <ShipmentTable
            data={result?.results}
            columns={columns}
            pageCount={result.paginatorInfo.pages}
          />
          {/* <ShippingCardsView shipData={shipmentData.data} /> */}
          {/* <CardViewPagination paginator={shipmentData?.paginatorInfo} /> */}
        </>
      ) : (
        <h1>No Records</h1>
      )}
    </div>
  );
};

export default UserDashboard;
