"use client";

import { useAdminUpdateShipment } from "@/services/admin/shipment.mutations";
import { Shipment, trackWithEnums } from "@/services/shipment.queries";
import { sanitizeObject } from "@/utils/common.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ModalCustom } from "../ModalComponent";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";
type AdminpdateShipmentFormSchemaType = z.infer<
  typeof AdminpdateShipmentFormSchema
>;

const AdminpdateShipmentFormSchema = z
  .object({
    trackWith: z.enum(trackWithEnums).optional(),
    containerNo: z
      .string()
      .transform((value) => value.toUpperCase())
      .optional(),
    mblNo: z
      .string()
      .transform((value) => value.toUpperCase())
      .optional(),
    carrier: z.string().optional(),
    tags: z.string().array().optional(),
    followers: z.string().email().array().optional(),
    referenceNo: z.string().optional(),
  })
  .strict();
interface AdminUpdateShipmentFormProps {
  shipmentData: Shipment;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}
const AdminUpdateShipmentForm = ({
  modalOpen,
  setModalOpen,
  shipmentData,
}: AdminUpdateShipmentFormProps) => {
  const initialValues: AdminpdateShipmentFormSchemaType = {
    followers: shipmentData?.followers || undefined,
    referenceNo: shipmentData?.referenceNo || undefined,
    tags: shipmentData?.tags || undefined,
    trackWith: shipmentData?.trackWith || undefined,
    carrier: shipmentData?.carrier || undefined,
    containerNo: shipmentData?.containerNo || undefined,
    mblNo: shipmentData?.mblNo || undefined,
  };

  const form = useForm<AdminpdateShipmentFormSchemaType>({
    resolver: zodResolver(AdminpdateShipmentFormSchema),
    values: initialValues,
  });
  const { control, handleSubmit } = form;

  const { mutate } = useAdminUpdateShipment({
    onSuccess(data, variables, context) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });

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

  const onSubmit = (data: AdminpdateShipmentFormSchemaType) => {
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
                    Update Single Shipment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 ">
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
                    <span className="mr-2">Update</span>
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
};

export default AdminUpdateShipmentForm;
