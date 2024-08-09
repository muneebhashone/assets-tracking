"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useUpdateShipment } from "@/services/shipment.mutations";
import { Shipment } from "@/services/shipment.queries";
import { sanitizeObject } from "@/utils/common.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TagsInput } from "react-tag-input-component";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

interface ShipmentDetailExtraFormProps {
  shipmentData: Shipment;
  shipmentField: "tags" | "followers";
  placeHolder?: string;
  showBar?: boolean;
}
type ShipmentDetailExtraInputType = z.infer<
  typeof ShipmentDetailExtraFormSchema
>;
const ShipmentDetailExtraFormSchema = z.object({
  followers: z
    .string()
    .email({ message: "Each follower must be a valid email address" })
    .array()
    .optional(),
  tags: z.string().array().optional(),
});
const ShipmentDetailExtraForm = ({
  shipmentData,
  shipmentField,
  placeHolder = "Enter your Details",
  showBar = false,
}: ShipmentDetailExtraFormProps) => {
  const initialValues: ShipmentDetailExtraInputType = {
    [shipmentField]: shipmentData?.[shipmentField],
  };

  const form = useForm({
    resolver: zodResolver(ShipmentDetailExtraFormSchema),
    defaultValues: initialValues,
  });
  const { mutate } = useUpdateShipment({
    onSuccess(data, variables, context) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });
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
  const onSubmit = (data: ShipmentDetailExtraInputType) => {
    if (data) {
      const sanitizedResult = sanitizeObject(data);
      mutate({ id: shipmentData.id, ...sanitizedResult });
    }
  };
  const { control, formState, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <FormField
            name={shipmentField}
            control={control}
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between  items-center">
                  <Label
                    htmlFor={shipmentField}
                    className="text-neutral-500 font-medium capitalize"
                  >
                    {shipmentField.toLowerCase()}
                  </Label>
                  {showBar && (
                    <Menubar>
                      <MenubarMenu>
                        <MenubarTrigger type="button">
                          <HamburgerMenuIcon />
                        </MenubarTrigger>
                        <MenubarContent>
                          <MenubarItem>Generate Tracking Email</MenubarItem>
                          <MenubarSeparator />
                          <MenubarItem>Share</MenubarItem>
                       
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  )}
                </div>
                <FormControl>
                  <TagsInput
                    placeHolder={placeHolder}
                    classNames={{
                      input:
                        "bg-white !w-full !text-sm placeholder:!text-muted-foreground",
                    }}
                    {...field}
                  />
                </FormControl>
                {Array.isArray(formState?.errors?.followers) &&
                  formState?.errors?.followers?.map((error, index) => {
                    return (
                      <div
                        key={index}
                        className="text-[0.8rem] font-medium text-destructive"
                      >
                        {error?.message + `. Entry Field #  ${index + 1}`}
                      </div>
                    );
                  })}
              </FormItem>
            )}
          />
        </div>

        <Button className="mt-4 mb-4 bg-golden" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ShipmentDetailExtraForm;
