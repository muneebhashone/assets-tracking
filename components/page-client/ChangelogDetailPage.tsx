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
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetChangelogById } from "@/services/changelog.queries";
import { useDeleteChangelog } from "@/services/changelog.mutations";
import type { ChangelogType } from "@/types/services/changelog.types";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash,
  Zap,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import ChangelogForm from "@/components/forms/changelog-form";
import { useCurrentUser } from "@/services/auth.mutations";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

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

const typeColorTextMap: Record<ChangelogType, string> = {
  FEATURE: "text-green-500",
  BUGFIX: "text-yellow-500",
  SECURITY: "text-red-500",
  IMPROVEMENT: "text-blue-500",
  BREAKING_CHANGE: "text-purple-500",
};

const typeIconMap: Record<ChangelogType, JSX.Element> = {
  FEATURE: <Zap className="h-5 w-5" />,
  BUGFIX: <CheckCircle2 className="h-5 w-5" />,
  SECURITY: <AlertCircle className="h-5 w-5" />,
  IMPROVEMENT: <Zap className="h-5 w-5" />,
  BREAKING_CHANGE: <AlertCircle className="h-5 w-5" />,
};

const ChangelogDetailPage = ({ id }: ChangelogDetailPageProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const isSuperAdmin = currentUser?.user.role === "SUPER_ADMIN";

  const { data, isLoading } = useGetChangelogById(Number(id));
  const changelog = data?.data;

  const { mutate: deleteChangelog, isPending: isDeleting } = useDeleteChangelog(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Changelog deleted successfully",
        });
        router.push("/dashboard/changelogs");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to delete changelog",
          variant: "destructive",
        });
      },
    },
  );

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this changelog?")) {
      deleteChangelog({ id: Number(id) });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
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
        <div className="flex items-center gap-2 mb-6">
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
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              The requested changelog could not be found.
            </p>
            <Link href="/dashboard/changelogs">
              <Button className="mt-4">Return to Changelogs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
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
        <h1 className="text-2xl font-bold flex-grow">Changelog Details</h1>
        {isSuperAdmin && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex items-center gap-1"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4" />
              <span>{isDeleting ? "Deleting..." : "Delete"}</span>
            </Button>
          </div>
        )}
      </div>

      <Card
        className="overflow-hidden border-t-8"
        style={{
          borderTopColor: `var(--${typeColorMap[changelog.type].replace(
            "bg-",
            "",
          )})`,
        }}
      >
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl">{changelog.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  className={`${
                    typeColorMap[changelog.type]
                  } text-white px-3 py-1`}
                >
                  <span className="flex items-center gap-1">
                    {typeIconMap[changelog.type]}
                    {changelog.type.replace("_", " ")}
                  </span>
                </Badge>
                {changelog.releaseDate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(changelog.releaseDate), "MMM dd, yyyy")}
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Created:{" "}
                  {format(new Date(changelog.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
              {changelog.updatedAt !== changelog.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Updated:{" "}
                    {format(new Date(changelog.updatedAt), "MMM dd, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        {changelog.description && (
          <CardContent className="pt-6">
            <div className="prose max-w-none bg-muted/50 p-4 rounded-md">
              <p>{changelog.description}</p>
            </div>
          </CardContent>
        )}

        <CardContent className="pt-4">
          <div className="space-y-8">
            {/* Features section */}
            {changelog.changes.features &&
              changelog.changes.features.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-md ${typeColorTextMap.FEATURE} bg-green-50 dark:bg-green-900/20`}
                    >
                      <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold">Features</h3>
                  </div>

                  <ul className="grid gap-3 pl-4">
                    {changelog.changes.features.map((feature, index) => (
                      <li
                        key={`feature-${index.toString()}`}
                        className="bg-muted/30 p-3 rounded-md relative pl-6"
                      >
                        <div className="absolute left-[-8px] top-[14px] w-4 h-4 rounded-full bg-green-500 border-4 border-background" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Bug fixes section */}
            {changelog.changes.fixes && changelog.changes.fixes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-md ${typeColorTextMap.BUGFIX} bg-yellow-50 dark:bg-yellow-900/20`}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">Bug Fixes</h3>
                </div>

                <ul className="grid gap-3 pl-4">
                  {changelog.changes.fixes.map((fix, index) => (
                    <li
                      key={`fix-${index.toString()}`}
                      className="bg-muted/30 p-3 rounded-md relative pl-6"
                    >
                      <div className="absolute left-[-8px] top-[14px] w-4 h-4 rounded-full bg-yellow-500 border-4 border-background" />
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements section */}
            {changelog.changes.improvements &&
              changelog.changes.improvements.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-md ${typeColorTextMap.IMPROVEMENT} bg-blue-50 dark:bg-blue-900/20`}
                    >
                      <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold">Improvements</h3>
                  </div>

                  <ul className="grid gap-3 pl-4">
                    {changelog.changes.improvements.map(
                      (improvement, index) => (
                        <li
                          key={`improvement-${index.toString()}`}
                          className="bg-muted/30 p-3 rounded-md relative pl-6"
                        >
                          <div className="absolute left-[-8px] top-[14px] w-4 h-4 rounded-full bg-blue-500 border-4 border-background" />
                          {improvement}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-6 flex justify-end">
          <Link href="/dashboard/changelogs">
            <Button variant="outline">Back to Changelogs</Button>
          </Link>
        </CardFooter>
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
