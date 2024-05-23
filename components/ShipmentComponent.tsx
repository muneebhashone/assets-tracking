"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createShipmentEntry } from "@/services/shipment";
import { ICreateShipment } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface ShippingData {
  name: string;
  code: string;
}

type Props = {
  data: ShippingData[] | undefined;
};

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
const ShipmentComponent = (props: Props) => {
  const { data } = props;

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const session = useSession();

  const { register, handleSubmit, setValue, reset } = useForm<ICreateShipment>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const carrier = searchParams.get("carrier");
    const trackingNumber = searchParams.get("tracking_number");
    if (carrier) {
      setValue("carrier", carrier);
    }
    if (trackingNumber) {
      setValue("tracking_number", trackingNumber);
    }
  }, [searchParams]);

  const onSubmit = async (payload: ICreateShipment) => {
    setLoading(true);

    const response = await createShipmentEntry({
      carrier: payload.carrier,
      trackingNumber: payload.tracking_number,
      companyId: Number(session.data?.user.companyId),
      creatorId: Number(session.data?.user?.id),
    });
    setLoading(false);
    toast({ title: response.status, description: response.message });
    reset();
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
            <Suspense>
              <select
                className="border p-2 border-r-3"
                {...register("carrier")}
              >
                {/* <option value={shipmentType.SEARATE}>SEARATE</option> */}
                {data &&
                  data?.map((info, index) => {
                    return (
                      <option key={index} value={info.code}>
                        {info.name}
                      </option>
                    );
                  })}
              </select>
            </Suspense>
          </div>

          <label htmlFor="tracking_number">Enter your Tracking ID</label>
          <Input
            placeholder="xxxxxxxxxxxxx"
            type="text"
            {...register("tracking_number")}
          />
        </div>
        <Button
          className={`mt-5 flex justify-end absolute right-5 bg-[#D3991F] ${
            loading ? "opacity-35" : ""
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default ShipmentComponent;
