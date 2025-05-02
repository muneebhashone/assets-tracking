"use client";
import type { Container } from "@/types/services/shipment.types";
import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { shortenContainerSizeType } from "@/utils/shipment.utils";
import { useUpdateContainer } from "@/services/shipment.mutations";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import React from "react";
import { toast } from "sonner";

interface DeliveryDateCellProps {
  container: Container;
}

const DeliveryDateCell: React.FC<DeliveryDateCellProps> = ({ container }) => {
  const currentDate = container?.deliveryDate
    ? new Date(container.deliveryDate)
    : null;
  const [date, setDate] = React.useState<Date | null>(currentDate);
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutate: updateContainer, isPending } = useUpdateContainer({
    onSuccess: () => {
      toast.success("Delivery date updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update delivery date: ${error.message}`);
      // Reset to original date if update fails
      setDate(currentDate);
    },
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    const newDate = selectedDate || null;
    setDate(newDate);
    setIsOpen(false);

    if (newDate !== currentDate) {
      updateContainer({
        containerId: container.id,
        shipmentId: container.shipmentId as number,
        deliveryDate: newDate ? newDate.toISOString() : null,
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-[130px] justify-center text-center font-normal",
              !date && "text-muted-foreground hover:bg-transparent",
              isPending && "cursor-not-allowed opacity-50",
            )}
            disabled={isPending}
          >
            {isPending
              ? "Updating..."
              : date
              ? moment(date).format("DD/MM/YYYY")
              : "-"}
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const columns: ColumnDef<Container>[] = [
  {
    accessorKey: "container",
    header: "Container",
    cell: ({ row }) => <div>{row.original.containerNumber}</div>,
  },
  {
    accessorKey: "sizeType",
    header: "",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge
              variant="outline"
              className="bg-gray-500 text-white font-bold"
            >
              {shortenContainerSizeType(row.original.sizeType || "")}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.sizeType || "-"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "emptyToShipper",
    header: "Empty To Shipper",
    cell: ({ row }) => (
      <div>
        {row.original?.emptyToShipper
          ? moment(row.original?.emptyToShipper).format("DD/MM/YYYY")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "gateIn",
    header: "Gate In",
    cell: ({ row }) => (
      <div>
        {row.original?.gateIn
          ? moment(row.original?.gateIn).format("DD/MM/YYYY")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "gateOut",
    header: "Gate Out",
    cell: ({ row }) => (
      <div>
        {row.original?.gateOut
          ? moment(row.original?.gateOut).format("DD/MM/YYYY")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery Date",
    cell: ({ row }) => <DeliveryDateCell container={row.original} />,
  },
  {
    accessorKey: "emptyReturn",
    header: "Empty Return",
    cell: ({ row }) => (
      <div>
        {row.original?.emptyReturn
          ? moment(row.original?.emptyReturn).format("DD/MM/YYYY")
          : "-"}
      </div>
    ),
  },
];
