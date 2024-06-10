import React, { useState } from "react";
import {
  Control,
  UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { SVGAttributes } from "react";
import { CreateShipmentInputType } from "@/services/shipment.mutations";
import { FormField, FormItem } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  form: UseFormReturn<CreateShipmentInputType, any, undefined>;
  options: string[];
}
export function ComboBox(props: Props) {
  const { form, options } = props;

  const {} = useFieldArray({
    name: "followers",
    control: form.control,
    rules: { minLength: 1 },
  });

  return (
    <FormField
      control={form.control}
      name="followers"
      render={({ field }) => (
        <Select
          onValueChange={field.onChange}
          // disabled={isPending || isFetching}
          {...field}
        >
          <SelectTrigger id="followers">
            <SelectValue placeholder="Container Number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CONTAINER_NUMBER">Container Number</SelectItem>
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
  );
}

function ChevronsUpDownIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}
