"use client";

import { insertShipmentRecord, shipmentData } from "@/actions/addShipment";
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
import React from "react";
import { useForm } from "react-hook-form";
import { IShipmentData } from "@/types";
import { shipmentType } from "@/types/enums";
import { coins_err, internal_server_error } from "@/types/messgaes";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { removeCoins } from "@/actions/insertCoins";

type Props = {};

const schema = z.object({
  containerID: z
    .string({
      required_error: "Container id is required",
    })
    .min(1, { message: "invalid id" }),
  containerType: z.string({
    required_error: "Container Type is required",
  }),
});
const page = (props: Props) => {
  const { toast } = useToast();
  const { update, data: session } = useSession();
  const {
    formState: { errors },
    register,
    resetField,
    setValue,
    handleSubmit,
  } = useForm<IShipmentData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (payload: IShipmentData) => {
    const data = await shipmentData(payload);
    const id = Number(session?.user.id);
    console.log(id)
    if (data === coins_err || data === internal_server_error) {
      return toast({
        title: "Error",
        description: data,
        variant: "destructive",
      });
    }

    const insert = await insertShipmentRecord(id, data);
    // await removeCoins(id);
    return toast({
      title: "Success",
      description: insert as string,
    });
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
              {...register("containerType")}
            >
              <option value={shipmentType.ZIMLINE}>Zimline</option>
              <option value="others">Others</option>
            </select>
          </div>

          <label htmlFor="trackingID">Enter your Tracking ID</label>
          <Input
            placeholder="xxxxxxxxxxxxx"
            type="text"
            {...register("containerID")}
          />
        </div>
        <Button
          className="mt-5 flex justify-end absolute right-5"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default page;
