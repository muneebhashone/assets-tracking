"use client";

import { useGetShipments } from "@/services/shipment.queries";
import { useSearchParams } from "next/navigation";
import SearchBar from "../SearchBar";
import { columns } from "../tables/shipment-table/columns";
import { ShipmentTable } from "../tables/shipment-table/shipment-table";
import ShipmentCreationForm from "../forms/shipment-creation-form";

const AdminDashboard = () => {
  const searchParams = useSearchParams();

  const params = {
    searchString: (searchParams.get("search") as string) || "",
    limitParam: 9,
    pageParam: Number(searchParams.get("page")) || 1,
  };

  const { data: result, isLoading } = useGetShipments(params);

  return (
    <div className="flex flex-col ">
      <div className="  flex justify-between">
        <p className="text-lg font-bold tracking-tight mb-4 ">All shipment</p>
        <SearchBar />
      </div>
      <div className="flex my-5 justify-between">
        <ShipmentCreationForm />
        {/* <Button variant="default">Export as pdf</Button> */}
      </div>
      {result?.results?.length ? (
        <ShipmentTable
          data={result.results}
          columns={columns}
          pageCount={result.paginatorInfo.pages}
        />
      ) : (
        <h1>no record found</h1>
      )}
    </div>
  );
};

export default AdminDashboard;
