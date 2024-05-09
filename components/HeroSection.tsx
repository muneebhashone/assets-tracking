import React from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { auth } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { shipmentType } from "@/types/enums";
import {
  CarrierInputIcon,
  SearchIcon,
  TrackingIcon,
} from "@/components/Icons/index";
import { getAllSeaRatesContainer } from "@/services/searates";

const HeroSection = async () => {
  const data = await getAllSeaRatesContainer();
  const session = await auth();
  const submitHandler = async (formData: FormData) => {
    "use server";
    const [carrier, tracking_number] = Array(
      formData.get("carrier"),
      formData.get("tracking_number"),
    );

    if (session?.user) {
      redirect(
        `/dashboard/shipment/?carrier=${carrier}&tracking_number=${tracking_number}`,
      );
    } else {
      redirect(
        `/signin/?carrier=${carrier}&tracking_number=${tracking_number}`,
      );
    }
  };
  return (
    <div className="w-full h-[700px] md:h-[1040px] bg-[url('/images/containerbanner.png')] bg-cover bg-center bg-no-repeat flex md:items-start justify-center pt-48">
      <div className="container">
        <h2 className="capitalize text-5xl font-semibold text-white">
          container Tracking
        </h2>
        <p className="text-xl text-white mt-5">
          Reach live position of your shipment.
        </p>
        <div className="mt-10">
          <span className="inline-flex gap-1 items-center bg-white px-5 py-2 radius-main">
            <span>
              <TrackingIcon />
            </span>
            <span className="inline ml-2 font-medium text-xl">Tracking</span>
          </span>
          <form action={submitHandler}>
            <div className="py-5 px-5 bg-white max-w-[640px] rounded-r-[10px] rounded-b-[10px] rounde-l-[0px]">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Carrier of Shipment"
                  name="tracking_number"
                  className="md:w-[600px] h-[60px] px-16 text-[#A8A8A8] border border-[#A8A8A8]"
                />
                <div className="absolute left-0 top-0 flex items-center justify-center h-full px-3 ">
                  <CarrierInputIcon />
                  <div className="w-[2px] h-10 bg-[#A8A8A8] ml-2"></div>
                </div>
              </div>
              <div className="relative mt-5">
                <select
                  // className="border p-2 border-r-3"
                  name="carrier"
                  className="md:w-[600px] h-[60px] px-16 text-[#A8A8A8] border border-[#A8A8A8]"
                >
                  {/* <option value={shipmentType.ZIMLINE}>Zimline</option> */}
                  {data &&
                    data?.map((info) => {
                      return <option value={info.code}>{info.name}</option>;
                    })}
                  <option value="others">Others</option>
                </select>
                {/* <Input
                  type="text"
                  name="tracking_number"
                  placeholder="Container/booking/bill of loading"
                  className="md:w-[600px] h-[60px] px-16 text-[#A8A8A8] border border-[#A8A8A8]"
                /> */}
                <div className="absolute left-0 top-0 flex items-center justify-center h-full px-3">
                  <SearchIcon />
                  <div className="w-[2px] h-10 bg-[#A8A8A8] ml-2"></div>
                </div>
              </div>
              <div className="text-end mt-5">
                <Button className="bg-[#D3991F] text-white text-lg py-5">
                  Track shipment
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
