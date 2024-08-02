"use client";
import ProtectedCheckbox from "@/components/ProtectedCheckbox";
import UploadedFilesView from "@/components/UploadedFilesView";
import { Shipment } from "@/services/shipment.queries";
import { TrackWithDisplay } from "@/utils/constants";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { CellAction } from "./cell-action";

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
    accessorKey: "pol.date",
    header: () => <p className="text-center">{"POD"}</p>,
    cell: ({ row }) => (
      <div className="flex  items-center flex-col">
        <p className="font-bold text-center">
          {row.original?.pol?.location ? row.original.pol.location.name : "NA"}
        </p>
        <p>
          {row.original?.pol?.date
            ? moment(row.original.pol.date).format("DD/MM/YYYY")
            : "NA"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "pod.date",
    header: () => <p className="text-center">{"POL"}</p>,
    cell: ({ row }) => (
      <div className="flex items-center flex-col">
        <p className="font-bold text-center">
          {row.original?.pod?.location ? row.original.pod.location.name : "NA"}
        </p>
        <p>
          {row.original?.pod?.date
            ? moment(row.original.pod.date).format("DD/MM/YYYY")
            : "NA"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
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
