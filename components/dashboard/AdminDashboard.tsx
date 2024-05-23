import React from "react";
import { ShippingCardsView } from "../ui/ShippingCardView";
import { getAllShipments } from "@/actions/shipmentActions";
import { Shipment } from "@prisma/client";
import { ShipmentData, shipmentDataWithPagination } from "@/types";
import CardViewPagination from "../pagination/CardViewPagination";
import { ReadonlyURLSearchParams } from "next/navigation";
import SearchBar from "../SearchBar";
import { ShipmentTable } from "../tables/shipment-table/shipment-table";
import { columns } from "../tables/shipment-table/columns";

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const AdminDashboard = async (props: Props) => {
  const { searchParams } = props;

  const params = {
    searchString: (searchParams?.search as string) || null,
    limitParam: 9,
    pageParam: Number(searchParams?.page) || 1,
  };
  const shipmentResponse = (await getAllShipments(
    params,
  )) as shipmentDataWithPagination;

  return (
    <div className="flex flex-col ">
      <div className="  flex justify-between">
        <p className="text-lg font-bold tracking-tight mb-4 ">All shipment</p>
        <SearchBar />
      </div>

      {shipmentResponse?.data?.length ? (
        <ShipmentTable
          data={shipmentResponse.data}
          columns={columns}
          pageCount={shipmentResponse.paginatorInfo.pages}
          searchParams={searchParams}
        />
      ) : (
        <h1>no record found</h1>
      )}
    </div>
  );
};

export default AdminDashboard;
