"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateShipmentInputType,
  useCreateShipment,
} from "@/services/shipment.mutations";
import { CheckCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const TrackWithEnum = z.enum(["CONTAINER_NUMBER", "MBL_NUMBER"]);

const CreateShipmentInputSchema = z.object({
  trackWith: TrackWithEnum,
  containerNo: z
    .string()
    .nullable()
    .transform((value) => (value ? value.toUpperCase() : null)),
  mblNo: z
    .string()
    .nullable()
    .transform((value) => (value ? value.toUpperCase() : null)),
  carrier: z
    .string()
    .nonempty({ message: "Carrier is required and cannot be empty" }),
  tags: z.string().array(),
  followers: z
    .string()
    .email({ message: "Each follower must be a valid email address" })
    .array(),
  referenceNo: z.string().nullable(),
});

export default function ShipmentCreationForm() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const initialValues = {};
  const router = useRouter();
  const form = useForm<CreateShipmentInputType>({
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
      router.push("/signin");
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
  const { control, register, formState, handleSubmit, setValue, watch } = form;
  const onSubmit = (data: CreateShipmentInputType) => {
    mutate({ ...data, tags: [], followers: [] });
  };
  // console.log(watch());
  return (
    <>
      <Button
        className="border rounded-md px-4 py-2 bg-[#D3991F] text-white hover:bg-zinc-900"
        onClick={() => setModalOpen((prev) => !prev)}
      >
        Create
      </Button>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-950">
            <Card className="w-full max-w-xl">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-zinc-700">
                  Single Shipment
                </CardTitle>
                <CardDescription className="mt-2 mb-6">
                  <p className="text-neutral-300 text-sm mb-6">
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
                      Click to the "Create" button.
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 ">
                <div className="flex justify-between gap-4">
                  <div className="space-y-2 w-[100%]">
                    <Label
                      htmlFor="carrier"
                      className="text-neutral-500 font-medium"
                    >
                      Carrier
                    </Label>
                    <Select {...register("carrier")}>
                      <SelectTrigger id="carrier">
                        <SelectValue placeholder="Select a carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carrier1">Carrier 1</SelectItem>
                        <SelectItem value="carrier2">Carrier 2</SelectItem>
                        <SelectItem value="carrier3">Carrier 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 w-[100%]">
                    <Label
                      htmlFor="trackWith"
                      className="text-neutral-500 font-medium"
                    >
                      Track with
                    </Label>
                    <FormField
                      control={control}
                      name="trackWith"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          // disabled={isPending || isFetching}
                          {...field}
                        >
                          <SelectTrigger id="trackWith">
                            <SelectValue placeholder="Container Number" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CONTAINER_NUMBER">
                              Container Number
                            </SelectItem>
                            <SelectItem
                              value="MBL_NUMBER"
                              className="text-neutral-500 font-medium"
                            >
                              MBL / Booking Number
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="containerNo"
                    className="text-neutral-500 font-medium"
                  >
                    Container Number
                  </Label>
                  <Input
                    id="containerNo"
                    placeholder="Enter Container Number"
                    {...register("containerNo")}
                  />
                </div>
                {watch("trackWith") === "MBL_NUMBER" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="mblNo"
                      className="text-neutral-500 font-medium"
                    >
                      MBL / Booking Number
                    </Label>
                    <Input
                      id="mblNo"
                      placeholder="Enter Mobile or Lading Number"
                      {...register("mblNo")}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label
                    htmlFor="tags"
                    className="text-neutral-500 font-medium"
                  >
                    Tags
                  </Label>
                  {/* <Combobox
                multiple
                options={["Tag1", "Tag2", "Tag3"]}
                value={formState.values.tags}
                onChange={(value) => setValue("tags", value)}
              /> */}
                </div>
                {/* <div className="space-y-2">
              <Label
                htmlFor="followers"
                className="text-neutral-500 font-medium"
              >
                Followers
              </Label> */}
                {/* <ComboBox form={form} options={["first"]} /> */}
                {/* <Input
                id="followers"
                placeholder="Enter Follower Emails (comma-separated)"
                {...register("followers")}
              /> */}
                {/* </div> */}
                <div className="space-y-2">
                  <Label
                    htmlFor="referenceNo"
                    className="text-neutral-500 font-medium"
                  >
                    Reference Number
                  </Label>
                  <Input
                    id="referenceNo"
                    placeholder="Enter Reference Number"
                    {...register("referenceNo")}
                  />
                </div>
              </CardContent>
              <CardFooter className="w-full justify-end ">
                <Button
                  type="submit"
                  className="w-[25%] border-r-4 bg-[#D3991F]"
                >
                  <span className="mr-2">Create</span>
                  <PlusCircledIcon />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Modal>
    </>
  );
}
