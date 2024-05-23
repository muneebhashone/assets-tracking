import React from "react";
import { Button } from "../ui/button";
import { ShipmentTable } from "../tables/shipment-table/shipment-table";
import Link from "next/link";
import { ShippingCardsView } from "../ui/ShippingCardView";
import { getShipmentByUserId } from "@/actions/shipmentActions";
import { auth } from "@/lib/auth-options";
import { Session } from "next-auth";
import { Shipment } from "@prisma/client";
import CardViewPagination from "../pagination/CardViewPagination";
import { shipmentDataWithPagination } from "@/types";
import SearchBar from "../SearchBar";
import { columns } from "../tables/shipment-table/columns";

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const UserDashboard = async (props: Props) => {
  // type Payment = {
  //   id: string;
  //   shipment: string;
  //   do: number;
  //   status: "pending" | "processing" | "success" | "failed";
  //   da: string;
  // };
  // const data: Payment[] = [

  // ];
  const { searchParams } = props;
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;

  const session = (await auth()) as Session;
  const params = {
    searchString: (searchParams?.search as string) || null,
    limitParam: 9,
    pageParam: Number(searchParams?.page) || 1,
    creatorId: Number(session.user.id),
    companyId: Number(session.user?.companyId),
  };
  const shipmentData = (await getShipmentByUserId(
    params,
  )) as shipmentDataWithPagination;

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
        <Link
          className="border rounded-md px-4 py-2 bg-[#D3991F] text-white hover:bg-zinc-900"
          href="/dashboard/shipment"
        >
          Create
        </Link>
        {/* <Button variant="default">Export as pdf</Button> */}
      </div>
      {shipmentData?.data?.length ? (
        <>
          <ShipmentTable
            data={shipmentData.data}
            columns={columns}
            pageCount={shipmentData.paginatorInfo.pages}
            searchParams={searchParams}
          />
          {/* <ShippingCardsView shipData={shipmentData.data} /> */}
          {/* <CardViewPagination paginator={shipmentData?.paginatorInfo} /> */}
        </>
      ) : (
        <h1>no record found</h1>
      )}
    </div>
  );
};

export default UserDashboard;
