"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
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
import { AlertCircle, CheckCircle2, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Type color and icon mappings
const typeColorMap: Record<ChangelogType, string> = {
  FEATURE: "bg-green-500",
  BUGFIX: "bg-yellow-500",
  SECURITY: "bg-red-500",
  IMPROVEMENT: "bg-blue-500",
  BREAKING_CHANGE: "bg-purple-500",
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
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: currentUser } = useCurrentUser();
  const isSuperAdmin = currentUser?.user.role === "SUPER_ADMIN";

  const { data: changelogs, isLoading } = useGetChangelogs({
    pageParam: page,
    limitParam: limit,
    type: typeFilter || undefined,
  });

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
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
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <Skeleton className="h-7 w-48 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {changelogs?.data.data.length === 0 ? (
            <div className="text-center py-10 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">No changelogs found.</p>
              {isSuperAdmin && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4"
                  variant="outline"
                >
                  Create your first changelog
                </Button>
              )}
            </div>
          ) : (
            <>
              {sortedDates.map((date) => (
                <div key={date} className="space-y-4">
                  <h2 className="text-xl font-bold border-b pb-2">{date}</h2>
                  <div className="space-y-6">
                    {groupedChangelogs[date].map((changelog) => (
                      <Card
                        key={changelog.id}
                        className="overflow-hidden border-l-4"
                        style={{
                          borderLeftColor: `var(--${typeColorMap[
                            changelog.type
                          ].replace("bg-", "")})`,
                        }}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/dashboard/changelogs/${changelog.id}`}
                            >
                              <CardTitle className="text-lg hover:underline">
                                {changelog.title}
                              </CardTitle>
                            </Link>
                            <div className="flex items-center gap-3">
                              {changelog.releaseDate && (
                                <span className="text-sm text-muted-foreground">
                                  {format(
                                    new Date(changelog.releaseDate),
                                    "MMM dd, yyyy",
                                  )}
                                </span>
                              )}
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
                          </div>
                          {changelog.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {changelog.description}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent className="pt-2 space-y-4">
                          {changelog.changes.features &&
                            changelog.changes.features.length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold mb-1 flex items-center gap-1">
                                  <span className="text-green-500">
                                    <Zap className="h-4 w-4 inline" />
                                  </span>
                                  Features
                                </h3>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                  {changelog.changes.features.map(
                                    (feature, index) => (
                                      <li key={`feature-${index.toString()}`}>
                                        {feature}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}

                          {changelog.changes.fixes &&
                            changelog.changes.fixes.length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold mb-1 flex items-center gap-1">
                                  <span className="text-yellow-500">
                                    <CheckCircle2 className="h-4 w-4 inline" />
                                  </span>
                                  Bug Fixes
                                </h3>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                  {changelog.changes.fixes.map((fix, index) => (
                                    <li key={`fix-${index.toString()}`}>
                                      {fix}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {changelog.changes.improvements &&
                            changelog.changes.improvements.length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold mb-1 flex items-center gap-1">
                                  <span className="text-blue-500">
                                    <Zap className="h-4 w-4 inline" />
                                  </span>
                                  Improvements
                                </h3>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                  {changelog.changes.improvements.map(
                                    (improvement, index) => (
                                      <li
                                        key={`improvement-${index.toString()}`}
                                      >
                                        {improvement}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              {changelogs?.data.meta &&
                changelogs.data.meta.total > page * limit && (
                  <div className="flex justify-center pt-4">
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
    </div>
  );
};

export default ChangelogListPage;
