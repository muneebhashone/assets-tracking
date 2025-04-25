"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useGetChangelogs } from "@/services/changelog.queries";
import { columns } from "../tables/changelog-table/columns";
import { ChangelogTable } from "../tables/changelog-table/changelog-table";
import { TableFallback } from "../fallback/table-fallback";
import type { Changelog } from "@/types/services/changelog.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChangelogForm from "@/components/forms/changelog-form";

const ChangelogListPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: changelogs, isLoading } = useGetChangelogs({
    pageParam: page,
    limitParam: limit,
    type: typeFilter || undefined,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Changelogs</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by type:</span>
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                <SelectItem value="FEATURE">Feature</SelectItem>
                <SelectItem value="BUGFIX">Bug Fix</SelectItem>
                <SelectItem value="SECURITY">Security</SelectItem>
                <SelectItem value="IMPROVEMENT">Improvement</SelectItem>
                <SelectItem value="BREAKING_CHANGE">Breaking Change</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Changelog</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <TableFallback rows={5} columns={5} />
      ) : (
        <ChangelogTable
          columns={columns}
          data={(changelogs?.data || []) as Changelog[]}
          pageCount={Math.ceil((changelogs?.meta.total || 0) / limit)}
        />
      )}

      {isCreateModalOpen && (
        <ChangelogForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ChangelogListPage;
