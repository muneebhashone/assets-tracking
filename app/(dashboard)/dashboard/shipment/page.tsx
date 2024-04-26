"use client";

import { insertShipmentRecord } from "@/actions/shipmentActions";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ICreateShipment, IResponse, IShipmentData } from "@/types";
import { shipmentType } from "@/types/enums";
import { coins_err, internal_server_error } from "@/types/messgaes";
import { useToast } from "@/components/ui/use-toast";


type Props = {};

const schema = z.object({
  tracking_number: z
    .string({
      required_error: "Tracking Number is required",
    })
    .min(1, { message: "invalid id" }),
  carrier: z.string({
    required_error: "Please Select Carrier Type",
  }),
});
const page = (props: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false)

  // const { update, data: session } = useSession();
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset
  } = useForm<ICreateShipment>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (payload: ICreateShipment) => {
    setLoading(true)
    const insert = await insertShipmentRecord(payload) as IResponse;
    setLoading(false)
    insert.status === "success" ? toast({
      title: "Success",
      description: insert?.message as string,

    }) : toast({
      title: "Error",
      description: insert?.message as string,
      variant: "destructive",
    });
    reset()
  };
  return (
    <div className=" p-5 ">
      <Heading
        title="Single Shipment"
        description="You can track shipment by Container Number or MBL / Booking Number."
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" mt-5">
          <div className="my-5">
            <p>Carrier</p>
            <select
              className="border p-2 border-r-3"
              {...register("carrier")}
            >
              {/* <option value={shipmentType.ZIMLINE}>Zimline</option> */}
              <option value={shipmentType.SEARATE}>Sea Rates</option>
              <option value="others">Others</option>
            </select>
          </div>

          <label htmlFor="tracking_number">Enter your Tracking ID</label>
          <Input
            placeholder="xxxxxxxxxxxxx"
            type="text"
            {...register("tracking_number")}
          />
        </div>
        <Button
          className={`mt-5 flex justify-end absolute right-5 ${loading ? "opacity-35" : ""}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default page;
