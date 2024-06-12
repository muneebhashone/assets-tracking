"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import {
  CarrierInputIcon,
  SearchIcon,
  TrackingIcon,
} from "@/components/Icons/index";
import { useFetchAllSearatesContainers } from "@/services/searates.queries";

const HeroSection = () => {
  const { data } = useFetchAllSearatesContainers();

  const getContainers = () => {
    return data?.data.map((value) => {
      return {
        name: value.name,
        code: value.scac_codes[0],
      };
    });
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
          <form>
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
                  name="carrier"
                  className="md:w-[600px] h-[60px] px-16 text-[#A8A8A8] border border-[#A8A8A8]"
                >
                  {/* <option value={shipmentType.ZIMLINE}>Zimline</option> */}
                  {getContainers()?.map((info, index) => {
                    return (
                      <option key={index} value={info.code}>
                        {`${info.name} (${info.code})`}
                      </option>
                    );
                  })}
                  <option value="others">Others</option>
                </select>

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
