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
import { useUpdateShipment } from "@/services/shipment.mutations";
import { CheckCircledIcon } from "@radix-ui/react-icons";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
//@ts-ignore
import { TagsInput } from "react-tag-input-component";
import { z } from "zod";
import { ModalCustom } from "../ModalComponent";

import { Shipment } from "@/services/shipment.queries";
import { Label } from "../ui/label";
import { sanitizeObject } from "@/utils/common.utils";

interface UpdateFormProps {
  shipmentData: Shipment;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

type UpdateShipmenFormtInputType = z.infer<typeof UpdateShipmentInputSchema>;

const UpdateShipmentInputSchema = z.object({
  tags: z.string().array().optional(),
  followers: z
    .string()
    .email({ message: "Each follower must be a valid email address" })
    .array()
    .optional(),

  referenceNo: z.string().nullable(),
});

export default function UpdateShipmentForm({
  shipmentData,
  modalOpen,
  setModalOpen,
}: UpdateFormProps) {
  const initialValues: UpdateShipmenFormtInputType = {
    followers: shipmentData?.followers,
    referenceNo: shipmentData?.referenceNo,
    tags: shipmentData?.tags,
  };

  const form = useForm<UpdateShipmenFormtInputType>({
    resolver: zodResolver(UpdateShipmentInputSchema),
    defaultValues: initialValues,
  });
  const { control, formState, handleSubmit } = form;
  const { mutate } = useUpdateShipment({
    onSuccess(data, variables, context) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });
      // form.reset();
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
  
  const onSubmit = (data: UpdateShipmenFormtInputType) => {
    if (data) {
      const sanitizedResult = sanitizeObject(data);
      mutate({ id: shipmentData.id, ...sanitizedResult });
    }
  };

  return (
    <>
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
                    className="w-[25%] border-r-4 bg-golden"
                  >
                    <span className="mr-2">Update</span>
                    {/* <PlusCircledIcon /> */}
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
