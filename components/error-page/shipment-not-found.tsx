import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const ShipmentNotFound = () => {
  return (
    <div className="w-full h-[700px] md:h-[100vh] bg-[url('/images/containerbanner.png')] bg-cover bg-center bg-no-repeat flex md:items-start justify-center pt-48">
      <div className="container">
        <h2 className="capitalize text-5xl font-semibold text-white">
          Shipment Not Found
        </h2>
        <p className="text-xl text-white mt-5">
          Please provide a valid shipment ID to view the live location.
        </p>
        <div className="mt-10">
          <span className="inline-flex gap-1 items-center bg-white px-5 py-2 radius-main">
            <span className="inline ml-2 font-medium text-xl">Error</span>
          </span>
          <div className="py-5 px-5 bg-white max-w-[640px] text-[#797979] rounded-r-[10px] rounded-b-[10px] rounde-l-[0px]">
            <p className="mb-5">
              The shipment ID you&apos;re looking for couldn&apos;t be found.
              Please check the ID and try again.
            </p>
            <div className="text-end">
              <Link href="/">
                <Button className="bg-[#D3991F] hover:bg-[#bf8c1e] text-white text-lg py-5">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentNotFound;
