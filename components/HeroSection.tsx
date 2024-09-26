"use client";

import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { CarrierInputIcon, TrackingIcon } from "@/components/Icons/index";
import { useCurrentUser } from "@/services/auth.mutations";
import { useFetchAllSearatesContainerSetup } from "@/services/searates.queries";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  tracksWith: z.enum(["CONTAINER_NUMBER", "MBL_NUMBER"]),
  containerNumber: z.string().optional(),
  mblNumber: z.string().optional(),
  carrier: z.string().min(1, "Carrier is required"),
});

const HeroSection = () => {
  const { data } = useFetchAllSearatesContainerSetup();
  const { data: user } = useCurrentUser();
  const { push } = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tracksWith: "CONTAINER_NUMBER",
      containerNumber: "",
      mblNumber: "",
      carrier: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const redirectUrl = new URL("/dashboard/shipment", window.location.origin);
    redirectUrl.searchParams.set("tracks-with", values.tracksWith);
    redirectUrl.searchParams.set(
      values.tracksWith === "CONTAINER_NUMBER"
        ? "container-number"
        : "mbl-number",
      values.tracksWith === "CONTAINER_NUMBER"
        ? values.containerNumber || ""
        : values.mblNumber || "",
    );
    redirectUrl.searchParams.set("carrier", values.carrier);

    if (user?.user) {
      push(redirectUrl.toString());
    } else {
      const signinUrl = new URL("/signin", window.location.origin);
      signinUrl.searchParams.set("tracks-with", values.tracksWith);
      signinUrl.searchParams.set(
        values.tracksWith === "CONTAINER_NUMBER"
          ? "container-number"
          : "mbl-number",
        values.tracksWith === "CONTAINER_NUMBER"
          ? values.containerNumber || ""
          : values.mblNumber || "",
      );
      signinUrl.searchParams.set("carrier", values.carrier);
      push(signinUrl.toString());
    }
  };

  const getContainers = () => {
    return data?.data?.map((value) => {
      return {
        name: value.name,
        code: value.scac_codes?.[0],
      };
    });
  };

  const options =
    getContainers()?.map((info) => ({
      value: info.code,
      name: `${info.name} (${info.code})`,
    })) || [];

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="py-5 px-5 bg-white max-w-[640px] text-[#797979] rounded-r-[10px] rounded-b-[10px] rounde-l-[0px]">
                <FormField
                  control={form.control}
                  name="tracksWith"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-0 top-0 flex items-center justify-center h-full px-3 pointer-events-none">
                            <SearchIcon className="text-[#A8A8A8]" />
                            <div className="w-[2px] h-10 bg-[#A8A8A8] ml-2"></div>
                          </div>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="md:w-[600px] h-[60px] pl-16 border border-[#A8A8A8] ">
                              <SelectValue placeholder="Select tracking method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CONTAINER_NUMBER">
                                Container Number
                              </SelectItem>
                              <SelectItem value="MBL_NUMBER">
                                Master Bill of Lading Number
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("tracksWith") === "CONTAINER_NUMBER" ? (
                  <FormField
                    control={form.control}
                    name="containerNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Container Number"
                              className="md:w-[600px] h-[60px] px-16 border border-[#A8A8A8] mt-5"
                            />
                            <div className="absolute left-0 top-0 flex items-center justify-center h-full px-3">
                              <CarrierInputIcon />
                              <div className="w-[2px] h-10 bg-[#A8A8A8] ml-2"></div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="mblNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Master Bill of Lading Number"
                              className="md:w-[600px] h-[60px] px-16 border border-[#A8A8A8] mt-5"
                            />
                            <div className="absolute left-0 top-0 flex items-center justify-center h-full px-3">
                              <CarrierInputIcon />
                              <div className="w-[2px] h-10 bg-[#A8A8A8] ml-2"></div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="carrier"
                  render={({ field }) => (
                    <FormItem className="relative mt-5">
                      <FormControl>
                        <div className="md:w-[600px] relative">
                          <Combobox
                            options={options}
                            placeholder="Carrier of Shipment"
                            className="h-[60px] border border-[#A8A8A8] text-[#797979] hover:text-[#797979] hover:bg-white pl-16"
                            {...field}
                          />
                          <div className="absolute left-0 top-0 flex items-center justify-center h-full px-3 pointer-events-none">
                            <SearchIcon className="text-[#A8A8A8]" />
                            <div className="w-[2px] h-10 bg-[#A8A8A8] ml-2"></div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-end mt-5">
                  <Button
                    type="submit"
                    className="bg-[#D3991F] hover:bg-[#bf8c1e] text-white text-lg py-5"
                  >
                    Track shipment
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
