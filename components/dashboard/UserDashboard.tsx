
import React from "react";
import { Button } from "../ui/button";
import { ShipmentTable } from "../tables/shipmentTable/shipmentTable";
import Link from "next/link";

type Props = {};

const UserDashboard = (props: Props) => {
  
  type Payment = {
    id: string;
    shipment: string;
    do: number;
    status: "pending" | "processing" | "success" | "failed";
    da: string;
  };
  const data: Payment[] = [
    
  ];

  return (
    <>

      <div className="flex flex-col ">
        <h1 className="text-lg font-bold tracking-tight">List of shipment</h1>
        <p className="text-sm tracking-tight">
          You can view, edit, delete or export all shipments from the table
          below.
        </p>
        <div className="flex my-5 justify-between">
        <Link 
        className="border rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
        href="/dashboard/shipment"
        >Create</Link>
          <Button variant="default">Export as pdf</Button>
        </div>
        {
          data ?
          <ShipmentTable data={data} />:<h1>no record found</h1>
        }
      </div>
    </>
  );
};

export default UserDashboard;
