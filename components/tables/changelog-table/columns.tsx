"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import type {
  Changelog,
  ChangelogType,
} from "@/types/services/changelog.types";
import { format } from "date-fns";

const typeColorMap: Record<ChangelogType, string> = {
  FEATURE: "bg-green-500",
  BUGFIX: "bg-yellow-500",
  SECURITY: "bg-red-500",
  IMPROVEMENT: "bg-blue-500",
  BREAKING_CHANGE: "bg-purple-500",
};

export const columns: ColumnDef<Changelog>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as ChangelogType;
      return (
        <Badge className={`${typeColorMap[type]} text-white`}>
          {type.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "releaseDate",
    header: "Release Date",
    cell: ({ row }) => {
      const date = row.getValue("releaseDate");
      if (!date) return "-";
      return format(new Date(date as string), "MMM dd, yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const changelog = row.original;
      return (
        <div className="flex justify-end">
          <Link href={`/dashboard/changelogs/${changelog.id}`}>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              title="View changelog details"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
