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
//@ts-ignore
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useFetchAllSearatesContainerSetup } from "@/services/searates.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
//@ts-ignore
import { TagsInput } from "react-tag-input-component";
import { z } from "zod";
import { ModalCustom } from "../ModalComponent";

import { Label } from "../ui/label";
import { Combobox, Options } from "../ui/combobox";
const TrackWithEnum = z.enum(["CONTAINER_NUMBER", "MBL_NUMBER"]);

const CreateShipmentInputSchema = z.object({
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
});

export default function ShipmentCreationForm() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const initialValues: z.infer<typeof CreateShipmentInputSchema> = {
    carrier: "",
    containerNo: "",
    followers: [],
    mblNo: null,
    referenceNo: null,
    tags: [],
    trackWith: "CONTAINER_NUMBER",
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
      setModalOpen(false);
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
  const { control, formState, handleSubmit, watch } = form;
  const onSubmit = (data: CreateShipmentInputType) => {
    mutate(data);
  };

  const containerNames = data?.data.map((value) => {
    return {
      name: value.name,
      value: value.scac_codes[0],
    };
  });

  return (
    <>
      <Button
        className="border rounded-md px-4 py-2 bg-[#D3991F] text-white hover:bg-zinc-900"
        onClick={() => setModalOpen((prev) => !prev)}
      >
        Create
      </Button>
      <ModalCustom
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-h-[70vh] overflow-auto min-w-[40rem] mild-scrollbar backdrop-opacity-50"
      >
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex  w-full items-center justify-center ">
              <Card className="w-full max-w-xl border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-zinc-700">
                    Single Shipment
                  </CardTitle>
                  <CardDescription className="mt-2 mb-6">
                    <p className="text-neutral-600 text-sm mb-6">
                      You can track shipment by Container Number or MBL /
                      Booking Number.
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
                <CardContent className="space-y-4 ">
                  <div className="flex justify-between gap-4">
                    <div className="space-y-2 w-[100%] contents ">
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
                                className="w-[15rem] justify-between "
                                options={containerNames as Options[]}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2 w-[100%]">
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
                                // tag: "!w-full",
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
                                // tag: "!w-full",
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
        </Form>
      </ModalCustom>
    </>
  );
}
