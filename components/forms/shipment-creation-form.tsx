"use client";

import { useFetchAllSearatesContainerSetup } from "@/services/searates.queries";
import {
  CreateShipmentInputType,
  useCreateShipment,
} from "@/services/shipment.mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

import { CheckCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { TagsInput } from "react-tag-input-component";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Combobox, Options } from "../ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";

const TrackWithEnum = z.enum(["CONTAINER_NUMBER", "MBL_NUMBER"]);

const CreateShipmentInputSchema = z
  .object({
    trackWith: TrackWithEnum,
    containerNo: z.string(),
    mblNo: z.string().nullable(),
    carrier: z
      .string()
      .nonempty({ message: "Carrier is required and cannot be empty" }),
    tags: z.string().array(),
    followers: z
      .string()
      .email({ message: "Each follower must be a valid email address" })
      .array(),

    referenceNo: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.trackWith === "CONTAINER_NUMBER" && !data.containerNo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Container Number is required",
        path: ["containerNo"],
      });
    }
    if (data.trackWith === "MBL_NUMBER" && !data.mblNo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "MBL / Booking Number is required",
        path: ["mblNo"],
      });
    }
  });

const ShipmentCreationForm = ({
  setModalOpen,
}: {
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const searchParams = useSearchParams();
  const initialValues: z.infer<typeof CreateShipmentInputSchema> = {
    carrier: searchParams.get("carrier") ?? "",
    containerNo: searchParams.get("container-number") ?? "",
    followers: [],
    mblNo: searchParams.get("mbl-number") ?? null,
    referenceNo: null,
    tags: [],
    trackWith: searchParams.get("tracks-with")
      ? (searchParams.get("tracks-with") as z.infer<typeof TrackWithEnum>)
      : "CONTAINER_NUMBER",
  };
  const { data } = useFetchAllSearatesContainerSetup();

  const form = useForm<z.infer<typeof CreateShipmentInputSchema>>({
    resolver: zodResolver(CreateShipmentInputSchema),
    defaultValues: initialValues,
  });
  const { mutate } = useCreateShipment({
    onSuccess(data, variables, context) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });
      form.reset();
      setModalOpen?.(false);
    },
    onError(error, variables, context) {
      if (error instanceof Error) {
        toast({
          title: error?.response?.data.message,
          duration: 2000,
          variant: "destructive",
        });
      }
    },
  });
  const { control, formState, handleSubmit, watch, setValue } = form;

  // Watch for changes in the trackWith field

  const onSubmit = (data: CreateShipmentInputType) => {
    mutate(data);
  };

  const containerNames = data?.data?.map((value) => {
    return {
      name: value.name,
      value: value.scac_codes?.[0],
    };
  });
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex w-full items-center justify-center">
          <Card className="w-full border-0 shadow-none ">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-zinc-700">
                Single Shipment
              </CardTitle>
              <CardDescription className="mt-2 mb-6">
                <p className="text-neutral-600 text-sm mb-6">
                  You can track shipment by Container Number or MBL / Booking
                  Number.
                </p>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircledIcon className="text-[#348cd4]" />
                  <span className="text-neutral-500 font-medium">
                    Choose the carrier.
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircledIcon className="text-[#348cd4]" />
                  <span className="text-neutral-500 font-medium">
                    Enter your Container, Booking or BL Number.
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircledIcon className="text-[#348cd4]" />
                  <span className="text-neutral-500 font-medium">
                    Click to the &quot;Create&quot; button.
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  name="carrier"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <Label
                        htmlFor="carrier"
                        className="text-neutral-500 font-medium"
                      >
                        Carrier
                      </Label>
                      <FormControl>
                        <Combobox
                          options={containerNames as Options[]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="trackWith"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <Label
                        htmlFor="trackWith"
                        className="text-neutral-500 font-medium"
                      >
                        Track with
                      </Label>
                      <FormControl>
                        <Select
                          onValueChange={(e) => {
                            field.onChange(e);
                            if (e === "CONTAINER_NUMBER") {
                              setValue("mblNo", null);
                            }
                          }}
                          {...field}
                        >
                          <SelectTrigger id="trackWith">
                            <SelectValue placeholder="Container Number" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CONTAINER_NUMBER">
                              Container Number
                            </SelectItem>
                            <SelectItem value="MBL_NUMBER">
                              MBL / Booking Number
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  name="containerNo"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <Label
                        htmlFor="containerNo"
                        className="text-neutral-500 font-medium"
                      >
                        Container Number
                      </Label>
                      <FormControl>
                        <Input
                          id="containerNo"
                          placeholder="Enter Container Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {watch("trackWith") === "MBL_NUMBER" && (
                <div className="space-y-2">
                  <FormField
                    name="mblNo"
                    control={control}
                    render={({ field: { value, ...rest } }) => (
                      <FormItem>
                        <Label
                          htmlFor="mblNo"
                          className="text-neutral-500 font-medium "
                        >
                          MBL / Booking Number
                        </Label>
                        <FormControl>
                          <Input
                            id="mblNo"
                            placeholder="Enter Mobile or Lading Number"
                            value={value?.toString()}
                            {...rest}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className="space-y-2">
                <FormField
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <Label
                        htmlFor="tags"
                        className="text-neutral-500 font-medium"
                      >
                        Tags
                      </Label>
                      <FormControl>
                        <TagsInput
                          classNames={{
                            input:
                              "bg-white !w-full !text-sm placeholder:!text-muted-foreground",
                          }}
                          placeHolder="Enter Tags"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  name="followers"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <Label
                        htmlFor="followers"
                        className="text-neutral-500 font-medium"
                      >
                        Followers
                      </Label>
                      <FormControl>
                        <TagsInput
                          placeHolder="Enter Followers Email"
                          classNames={{
                            input:
                              "bg-white !w-full !text-sm placeholder:!text-muted-foreground",
                          }}
                          {...field}
                        />
                      </FormControl>
                      {formState.errors.followers?.length && (
                        <div className="text-[0.8rem] font-medium text-destructive">
                          {formState?.errors.followers?.[0]?.message}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  name="referenceNo"
                  control={control}
                  render={({ field: { value, ...rest } }) => (
                    <FormItem>
                      <Label
                        htmlFor="referenceNo"
                        className="text-neutral-500 font-medium"
                      >
                        Reference Number
                      </Label>
                      <FormControl>
                        <Input
                          id="referenceNo"
                          placeholder="Enter Reference Number"
                          value={value?.toString()}
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="w-full justify-end">
              <Button
                type="submit"
                className="w-full sm:w-auto px-8 border-r-4 bg-[#D3991F] hover:bg-[#bf8c1e]"
              >
                <span className="mr-2">Create</span>
                <PlusCircledIcon />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default ShipmentCreationForm;
