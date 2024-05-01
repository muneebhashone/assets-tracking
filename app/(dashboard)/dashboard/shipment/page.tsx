"use client";

import { insertShipmentRecord } from "@/actions/shipmentActions";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ICreateShipment, IResponse } from "@/types";
import { shipmentType } from "@/types/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchParams } from 'next/navigation'

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
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    reset
  } = useForm<ICreateShipment>({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    const carrier = searchParams.get('carrier')
    const trackingNumber = searchParams.get('tracking_number')
    if (carrier) {
      setValue('carrier', carrier)
    }
    if (trackingNumber) {
      setValue('tracking_number', trackingNumber)

    }
  }, [searchParams])
  // const { update, data: session } = useSession();


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
    if (insert.status === "success") {
      router.refresh();
      router.back()
    }
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
          className={`mt-5 flex justify-end absolute right-5 bg-[#D3991F] ${loading ? "opacity-35" : ""}`}
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
