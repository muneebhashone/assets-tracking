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
    header: () => <p className="text-center text-zinc-500">{"Reference"}</p>,
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
          <p className="text-center tracking-tighter font-bold text-zinc-500 ">
            {row.original.mblNo}
          </p>
        )}
        {row.original?.containers?.length > 0 && (
          <p className="text-center tracking-tighter text-gray-400 relative">
            {row.original?.containers.length === 1 ? (
              <span>{row.original?.containers[0].containerNumber}</span>
            ) : (
              <>
                <span>{row.original?.containers[0].containerNumber}</span>
                <span className="w-[20px] h-[18px] bg-gray-500 absolute top-[1px] left-[90px] text-[10px] font-normal rounded-md text-white text-center">
                  +{row.original?.containers.length - 1}
                </span>
              </>
            )}
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
          <p className="text-center tracking-tighter text-zinc-500 font-bold">{row.original.carrier}</p>
        )}
        {row.original?.sealine && (
          <p className="text-center tracking-tighter text-gray-400 ">
            {row.original.sealine}
          </p>
        )}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: () => <p className="text-center">{"Status"}</p>,
    cell: ({ row }) => (
      <div className="flex  items-center flex-col ">
        <p className="text-center tracking-tighter text-gray-400">
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
        <p className="font-bold text-center text-zinc-500">
          {row.original?.pol?.location ? row.original.pol.location.name : "-"}
        </p>
        <p className="text-gray-400">
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
        <p className="font-bold text-center text-zinc-500">
          {row.original?.pod?.location ? row.original.pod.location.name : "-"}
        </p>
        <p className="text-gray-400">
          {row.original?.pod?.date
            ? moment(row.original?.pod?.date).format("DD/MM/YYYY")
            : row.original.pod?.predictive_eta
            ? moment(row.original.pod?.predictive_eta).format("DD/MM/YYYY")
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
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
