"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import type {
  Changelog,
  ChangelogType,
} from "@/types/services/changelog.types";
import { format } from "date-fns";
import { useCurrentUser } from "@/services/auth.mutations";
import { useDeleteChangelog } from "@/services/changelog.mutations";
import { useToast } from "@/components/ui/use-toast";

const typeColorMap: Record<ChangelogType, string> = {
  FEATURE: "bg-green-500",
  BUGFIX: "bg-yellow-500",
  SECURITY: "bg-red-500",
  IMPROVEMENT: "bg-blue-500",
  BREAKING_CHANGE: "bg-purple-500",
};

// Cell component for actions column to properly use React hooks
interface ActionsCellProps {
  changelog: Changelog;
}

const ActionsCell = ({ changelog }: ActionsCellProps) => {
  const { data: currentUser } = useCurrentUser();
  const isSuperAdmin = currentUser?.user.role === "SUPER_ADMIN";
  const { toast } = useToast();
  const { mutate: deleteChangelog } = useDeleteChangelog({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Changelog deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete changelog",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (window.confirm("Are you sure you want to delete this changelog?")) {
      deleteChangelog({ id: changelog.id });
    }
  };

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
      {isSuperAdmin && (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          title="Delete changelog"
          onClick={handleDelete}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
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
    cell: ({ row }) => <ActionsCell changelog={row.original} />,
  },
];
