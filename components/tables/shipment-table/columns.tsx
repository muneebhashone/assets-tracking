"use client";
import ProtectedCheckbox from "@/components/ProtectedCheckbox";
import UploadedFilesView from "@/components/UploadedFilesView";
import { Shipment } from "@/services/shipment.queries";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { TrackWithDisplay } from "@/utils/constants";

export const columns: ColumnDef<Shipment>[] = [
  {
    id: "select",
    header: ({ table }) => <ProtectedCheckbox table={table} type="shipment" />,
    cell: ({ row }) => <ProtectedCheckbox row={row} type="shipment" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "Track With",
    cell: ({ row }) => <div> {TrackWithDisplay[row.original.trackWith]}</div>,
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

    cell: ({ row }) =>
      row?.original?.files?.length && <UploadedFilesView data={row.original} />,

    maxSize: 20,
    minSize: 30,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
