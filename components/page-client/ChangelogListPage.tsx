"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Clock,
  Calendar,
} from "lucide-react";
import { useGetChangelogs } from "@/services/changelog.queries";
import type {
  Changelog,
  ChangelogType,
} from "@/types/services/changelog.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChangelogForm from "@/components/forms/changelog-form";
import { useCurrentUser } from "@/services/auth.mutations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { AlertCircle, CheckCircle2, Zap, Edit, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteChangelog } from "@/services/changelog.mutations";

// Type color and icon mappings
const typeColorMap: Record<ChangelogType, string> = {
  FEATURE: "bg-green-500",
  BUGFIX: "bg-yellow-500",
  SECURITY: "bg-red-500",
  IMPROVEMENT: "bg-blue-500",
  BREAKING_CHANGE: "bg-purple-500",
};

const typeColorTextMap: Record<ChangelogType, string> = {
  FEATURE: "text-green-500",
  BUGFIX: "text-yellow-500",
  SECURITY: "text-red-500",
  IMPROVEMENT: "text-blue-500",
  BREAKING_CHANGE: "text-purple-500",
};

const typeIconMap: Record<ChangelogType, JSX.Element> = {
  FEATURE: <Zap className="h-4 w-4" />,
  BUGFIX: <CheckCircle2 className="h-4 w-4" />,
  SECURITY: <AlertCircle className="h-4 w-4" />,
  IMPROVEMENT: <Zap className="h-4 w-4" />,
  BREAKING_CHANGE: <AlertCircle className="h-4 w-4" />,
};

const ChangelogListPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const { toast } = useToast();
  const { data: currentUser } = useCurrentUser();
  const isSuperAdmin = currentUser?.user.role === "SUPER_ADMIN";

  const { data: changelogs, isLoading } = useGetChangelogs({
    pageParam: page,
    limitParam: limit,
    type: typeFilter || undefined,
  });

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

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleEdit = (id: number) => {
    setIsEditModalOpen(id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this changelog?")) {
      deleteChangelog({ id });
    }
  };

  // Group changelogs by release date (YYYY-MM)
  const groupedChangelogs = (changelogs?.data.data || []).reduce(
    (acc, changelog) => {
      const date = changelog.releaseDate
        ? format(new Date(changelog.releaseDate), "MMMM yyyy")
        : "Undated Releases";

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(changelog);
      return acc;
    },
    {} as Record<string, Changelog[]>,
  );

  // Sort the dates in descending order
  const sortedDates = Object.keys(groupedChangelogs).sort((a, b) => {
    if (a === "Undated Releases") return -1;
    if (b === "Undated Releases") return 1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="p-4 space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Changelogs</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
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
          {isSuperAdmin && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Changelog</span>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-7 w-48 mb-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {changelogs?.data.data.length === 0 ? (
            <div className="text-center py-6 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">No changelogs found.</p>
              {isSuperAdmin && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-2"
                  variant="outline"
                >
                  Create your first changelog
                </Button>
              )}
            </div>
          ) : (
            <>
              {sortedDates.map((date) => (
                <div key={date} className="space-y-2">
                  <h2 className="text-xl font-bold border-b pb-1 overflow-y-hidden">
                    {date}
                  </h2>
                  <div className="space-y-3">
                    {groupedChangelogs[date].map((changelog) => {
                      const isExpanded = expandedItems.includes(changelog.id);

                      return (
                        <Card
                          key={changelog.id}
                          className={`overflow-hidden border-l-4 transition-all ${
                            isExpanded ? "shadow-md" : ""
                          }`}
                          style={{
                            borderLeftColor: `var(--${typeColorMap[
                              changelog.type
                            ].replace("bg-", "")})`,
                          }}
                        >
                          <CardHeader className="py-2 px-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <div className="flex-grow">
                                <div className="flex items-center gap-1">
                                  <CardTitle className="text-lg">
                                    {changelog.title}
                                  </CardTitle>
                                  <Badge
                                    className={`${
                                      typeColorMap[changelog.type]
                                    } text-white px-2 py-0.5`}
                                  >
                                    <span className="flex items-center gap-1">
                                      {typeIconMap[changelog.type]}
                                      {changelog.type.replace("_", " ")}
                                    </span>
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                                  {changelog.releaseDate && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        {format(
                                          new Date(changelog.releaseDate),
                                          "MMM dd, yyyy",
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      Created:{" "}
                                      {format(
                                        new Date(changelog.createdAt),
                                        "MMM dd, yyyy",
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                {isSuperAdmin && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={() => handleEdit(changelog.id)}
                                    >
                                      <Edit className="h-3 w-3" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                      onClick={() => handleDelete(changelog.id)}
                                    >
                                      <Trash className="h-3 w-3" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => toggleExpand(changelog.id)}
                                >
                                  {isExpanded ? (
                                    <ChevronUpIcon className="h-3 w-3" />
                                  ) : (
                                    <ChevronDownIcon className="h-3 w-3" />
                                  )}
                                  <span className="sr-only">
                                    {isExpanded ? "Collapse" : "Expand"}
                                  </span>
                                </Button>
                              </div>
                            </div>

                            {!isExpanded && changelog.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {changelog.description}
                              </p>
                            )}
                          </CardHeader>

                          {isExpanded && (
                            <CardContent className="py-2 px-3 space-y-3">
                              {changelog.description && (
                                <div className="prose max-w-none bg-muted/50 p-2 rounded-md">
                                  <p>{changelog.description}</p>
                                </div>
                              )}

                              <div className="space-y-3">
                                {/* Features section */}
                                {changelog.changes.features &&
                                  changelog.changes.features.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-1">
                                        <div
                                          className={`p-1 rounded-md ${typeColorTextMap.FEATURE} bg-green-50 dark:bg-green-900/20`}
                                        >
                                          <Zap className="h-3 w-3" />
                                        </div>
                                        <h3 className="text-base font-semibold">
                                          Features
                                        </h3>
                                      </div>

                                      <ul className="grid gap-1 pl-2">
                                        {changelog.changes.features.map(
                                          (feature, index) => (
                                            <li
                                              key={`feature-${index.toString()}`}
                                              className="bg-muted/30 p-2 rounded-md relative pl-5"
                                            >
                                              <div className="absolute left-[-6px] top-[12px] w-3 h-3 rounded-full bg-green-500 border-3 border-background" />
                                              {feature}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                {/* Bug fixes section */}
                                {changelog.changes.fixes &&
                                  changelog.changes.fixes.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-1">
                                        <div
                                          className={`p-1 rounded-md ${typeColorTextMap.BUGFIX} bg-yellow-50 dark:bg-yellow-900/20`}
                                        >
                                          <CheckCircle2 className="h-3 w-3" />
                                        </div>
                                        <h3 className="text-base font-semibold">
                                          Bug Fixes
                                        </h3>
                                      </div>

                                      <ul className="grid gap-1 pl-2">
                                        {changelog.changes.fixes.map(
                                          (fix, index) => (
                                            <li
                                              key={`fix-${index.toString()}`}
                                              className="bg-muted/30 p-2 rounded-md relative pl-5"
                                            >
                                              <div className="absolute left-[-6px] top-[12px] w-3 h-3 rounded-full bg-yellow-500 border-3 border-background" />
                                              {fix}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                {/* Improvements section */}
                                {changelog.changes.improvements &&
                                  changelog.changes.improvements.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-1">
                                        <div
                                          className={`p-1 rounded-md ${typeColorTextMap.IMPROVEMENT} bg-blue-50 dark:bg-blue-900/20`}
                                        >
                                          <Zap className="h-3 w-3" />
                                        </div>
                                        <h3 className="text-base font-semibold">
                                          Improvements
                                        </h3>
                                      </div>

                                      <ul className="grid gap-1 pl-2">
                                        {changelog.changes.improvements.map(
                                          (improvement, index) => (
                                            <li
                                              key={`improvement-${index.toString()}`}
                                              className="bg-muted/30 p-2 rounded-md relative pl-5"
                                            >
                                              <div className="absolute left-[-6px] top-[12px] w-3 h-3 rounded-full bg-blue-500 border-3 border-background" />
                                              {improvement}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}

              {changelogs?.data.meta &&
                changelogs.data.meta.total > page * limit && (
                  <div className="flex justify-center pt-2">
                    <Button variant="outline" onClick={handleLoadMore}>
                      Load More
                    </Button>
                  </div>
                )}
            </>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <ChangelogForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isEditModalOpen !== null && changelogs?.data.data && (
        <ChangelogForm
          isOpen={true}
          onClose={() => setIsEditModalOpen(null)}
          changelog={
            changelogs.data.data.find((c) => c.id === isEditModalOpen) ||
            undefined
          }
        />
      )}
    </div>
  );
};

export default ChangelogListPage;
