"use client";

import { ChevronLeftIcon } from "@/components/Icons/index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetChangelogById } from "@/services/changelog.queries";
import type { ChangelogType } from "@/types/services/changelog.types";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Edit, Zap } from "lucide-react";
import ChangelogForm from "@/components/forms/changelog-form";

interface ChangelogDetailPageProps {
  id: string;
}

const typeColorMap: Record<ChangelogType, string> = {
  FEATURE: "bg-green-500",
  BUGFIX: "bg-yellow-500",
  SECURITY: "bg-red-500",
  IMPROVEMENT: "bg-blue-500",
  BREAKING_CHANGE: "bg-purple-500",
};

const typeIconMap: Record<ChangelogType, JSX.Element> = {
  FEATURE: <Zap className="h-5 w-5" />,
  BUGFIX: <CheckCircle2 className="h-5 w-5" />,
  SECURITY: <AlertCircle className="h-5 w-5" />,
  IMPROVEMENT: <Zap className="h-5 w-5" />,
  BREAKING_CHANGE: <AlertCircle className="h-5 w-5" />,
};

const ChangelogDetailPage = ({ id }: ChangelogDetailPageProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading } = useGetChangelogById(Number(id));
  const changelog = data?.data;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <Link href="/dashboard/changelogs">
            <Button
              className="rounded-full border w-8 h-8"
              size="icon"
              variant="ghost"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <Skeleton className="h-6 w-32" />
          <div />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!changelog) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <Link href="/dashboard/changelogs">
            <Button
              className="rounded-full border w-8 h-8"
              size="icon"
              variant="ghost"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Changelog not found</h1>
          <div />
        </div>
        <div className="p-6 text-center">
          <p>The requested changelog could not be found.</p>
          <Link href="/dashboard/changelogs">
            <Button className="mt-4">Return to Changelogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <Link href="/dashboard/changelogs">
          <Button
            className="rounded-full border w-8 h-8"
            size="icon"
            variant="ghost"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Changelog #{changelog.id}</h1>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl">{changelog.title}</CardTitle>
            <CardDescription>
              Released on{" "}
              {changelog.releaseDate
                ? format(new Date(changelog.releaseDate), "MMMM dd, yyyy")
                : "Not specified"}
            </CardDescription>
          </div>
          <Badge
            className={`${typeColorMap[changelog.type]} text-white px-3 py-1`}
          >
            <span className="flex items-center gap-1">
              {typeIconMap[changelog.type]}
              {changelog.type.replace("_", " ")}
            </span>
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="prose max-w-none">
            <p className="text-muted-foreground">{changelog.description}</p>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            {changelog.changes.features &&
              changelog.changes.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Badge className="bg-green-500 text-white">Features</Badge>
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {changelog.changes.features.map((feature, index) => (
                      <li key={index.toString()}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

            {changelog.changes.fixes && changelog.changes.fixes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Badge className="bg-yellow-500 text-white">Bug Fixes</Badge>
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  {changelog.changes.fixes.map((fix, index) => (
                    <li key={index.toString()}>{fix}</li>
                  ))}
                </ul>
              </div>
            )}

            {changelog.changes.improvements &&
              changelog.changes.improvements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Badge className="bg-blue-500 text-white">
                      Improvements
                    </Badge>
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {changelog.changes.improvements.map(
                      (improvement, index) => (
                        <li key={index.toString()}>{improvement}</li>
                      ),
                    )}
                  </ul>
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {isEditModalOpen && changelog && (
        <ChangelogForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          changelog={changelog}
        />
      )}
    </div>
  );
};

export default ChangelogDetailPage;
