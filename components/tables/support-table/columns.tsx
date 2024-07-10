"use client";
import { SupportType } from "@/services/admin/support.queries";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<SupportType>[] = [
  {
    header: "S#",
    cell: ({ row }) => <p className="text-start ms-3">{row?.index + 1}</p>,
  },
  {
    accessorKey: "id",
    header: "Support ID",
  },
  {
    accessorKey: "Name",
    header: "name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "user.name",
    header: "Support Assign To",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    header: "Resolution Status",
    cell: ({ row }) => (
      <div className="text-start ms-3">
        <Badge
          className={`${
            row?.original.resolved ? "bg-green-500" : "bg-red-700"
          }`}
        >
          {row?.original.resolved ? "Resolved" : "Pending"}
        </Badge>{" "}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
