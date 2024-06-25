"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Shipment } from "@/services/shipment.queries";
import Link from "next/link";
import UploadedFilesView from "@/components/UploadedFilesView";

export const columns: ColumnDef<Shipment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "trackWith",
    header: "Track With",
  },
  {
    accessorKey: "containerNo",
    header: "Container No.",
  },
  {
    accessorKey: "mblNo",
    header: "MBL No.",
  },
  {
    accessorKey: "carrier",
    header: "Carrier",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "progress",
    header: "Progress",
  },
  {
    accessorKey: "arrivalTime",
    header: "ESTD. Time",
  },
  {
    accessorKey: "isTracking",
    header: "In Tracking",
  },
  {
    header: "Files",

    cell: ({ row }) =>(row?.original?.files?.length) && <UploadedFilesView data={row.original}/>,

    maxSize: 20,
    minSize: 30,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
