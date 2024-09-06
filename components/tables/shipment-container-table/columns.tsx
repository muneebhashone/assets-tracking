"use client";
import { Container } from "@/types/services/shipment.types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { shortenContainerSizeType } from "@/utils/shipment.utils";

// Function to shorten sizeType

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
            <Badge variant="outline" className="bg-gray-500 text-white font-bold">
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
