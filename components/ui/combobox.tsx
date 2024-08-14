"use client";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { ControllerRenderProps } from "react-hook-form";

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
interface ComboboxProps extends FormProps {
  options: Options[];
  placeholder?: string;
}

export function Combobox({
  options,
  placeholder = "Search from Options ...",
  ...rest
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);


  const { onChange, value, ...props } = rest;

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue);
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
          className="w-[15rem] justify-between "
        >
          {value
            ? options.find((option) => option.value === value)?.name
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        <Command
          filter={(value, search) => {
            if (
              options
                .find((option) => option.value === value)
                ?.name.toLowerCase()?.includes(search.toLowerCase())
            )
              return 1;
            return 0;
          }}
          {...props}
        >
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList className="max-h-[250px]">
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
                      value === option.value ? "opacity-100" : "opacity-0",
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
