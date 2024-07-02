"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControllerRenderProps } from "react-hook-form";
import { ScrollArea } from "./scroll-area";

export interface Options {
  value: string;
  name: string;
}
type FormProps = ControllerRenderProps<
  {
    trackWith: "CONTAINER_NUMBER" | "MBL_NUMBER";
    containerNo: string;
    mblNo: string | null;
    carrier: string;
    tags: string[];
    followers: string[];
    referenceNo: string | null;
  },
  "carrier"
>;
interface ComboboxProps extends ButtonProps , React.RefAttributes<HTMLButtonElement> {
  options: Options[];
  placeholder?: string;
  field?: FormProps;
}

export function Combobox({
  options,
  placeholder = "Search from Options ...",
  field,
  ...rest
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // const { onChange, value, ...rest } = field;

  const handleSelect = (currentValue: string) => {
    field?.onChange(currentValue === field?.value ? "" : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          id="carrier"
          {...rest}
        >
          {field?.value
            ? options.find((option) => option.value === field?.value)?.name
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, search) => {
            if (
              options
                .find((option) => option.value === value)
                ?.name.includes(search)
            )
              return 1;
            return 0;
          }}
          {...field}
        >
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No Options found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      field?.value === option.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
