"use client";
import ProtectedCheckbox from "@/components/ProtectedCheckbox";
import { Badge } from "@/components/ui/badge";
import UploadedFilesView from "@/components/UploadedFilesView";
import { Shipment } from "@/services/shipment.queries";
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
    accessorKey: "referenceNo",
    header: () => <p className="text-center">{"Reference"}</p>,
    cell: ({ row }) => (
      <div className="flex  items-center flex-col ">
        <p className="text-center tracking-tighter">
          {row.original?.referenceNo ? row.original?.referenceNo : "-"}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "shipment",
    header: () => <p className="text-center">{"Shipment"}</p>,
    cell: ({ row }) => (
      <div className="flex  items-center flex-col">
        {row.original?.mblNo && (
          <p className="text-center tracking-tighter">{row.original.mblNo}</p>
        )}
        {row.original?.containerNo && (
          <p className="text-center tracking-tighter">
            {row.original.containerNo}
          </p>
        )}
      </div>
    ),
  },

  {
    accessorKey: "carrier",
    header: () => <p className="text-center">{"Carrier"}</p>,
    cell: ({ row }) => (
      <div className="flex  items-center flex-col">
        {row.original?.carrier && (
          <p className="text-center tracking-tighter">{row.original.carrier}</p>
        )}
        {row.original?.sealine && (
          <p className="text-center tracking-tighter">{row.original.sealine}</p>
        )}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: () => <p className="text-center">{"Status"}</p>,
    cell: ({ row }) => (
      <div className="flex  items-center flex-col ">
        <p className="text-center tracking-tighter">
          {row.original?.status ? row.original?.status : "-"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "pol.date",
    header: () => <p className="text-center">{"Port of Loading"}</p>,
    cell: ({ row }) => (
      <div className="flex  items-center flex-col">
        <p className="font-bold text-center">
          {row.original?.pol?.location ? row.original.pol.location.name : "-"}
        </p>
        <p>
          {row.original?.pol?.date
            ? moment(row.original.pol.date).format("DD/MM/YYYY")
            : "-"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "pod.date",
    header: () => <p className="text-center">{"Port of Destination"}</p>,
    cell: ({ row }) => (
      <div className="flex items-center flex-col">
        <p className="font-bold text-center">
          {row.original?.pod?.location ? row.original.pod.location.name : "-"}
        </p>
        <p>
          {row.original?.pod?.date
            ? moment(row.original.pod.date).format("DD/MM/YYYY")
            : "-"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) =>
      row.original?.tags &&
      row.original?.tags.map((tag, index) => {
        return (
          <div className="flex flex-row mb-2" key={index}>
            <p className="font-bold">
              <Badge className="bg-slate-500 cursor-pointer">{tag}</Badge>
            </p>
          </div>
        );
      }),
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
