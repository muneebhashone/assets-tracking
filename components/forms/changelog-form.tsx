"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateChangelog,
  useUpdateChangelog,
} from "@/services/changelog.mutations";
import type {
  Changelog,
  ChangelogType,
} from "@/types/services/changelog.types";
import { format } from "date-fns";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ChangelogFormProps {
  isOpen: boolean;
  onClose: () => void;
  changelog?: Changelog;
}

const ChangelogForm = ({ isOpen, onClose, changelog }: ChangelogFormProps) => {
  const { toast } = useToast();
  const isEditMode = !!changelog;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ChangelogType>("FEATURE");
  const [releaseDate, setReleaseDate] = useState("");

  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const [fixes, setFixes] = useState<string[]>([]);
  const [newFix, setNewFix] = useState("");

  const [improvements, setImprovements] = useState<string[]>([]);
  const [newImprovement, setNewImprovement] = useState("");

  const { mutate: createChangelog, isPending: isCreating } = useCreateChangelog(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Changelog created successfully",
        });
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create changelog",
          variant: "destructive",
        });
      },
    },
  );

  const { mutate: updateChangelog, isPending: isUpdating } = useUpdateChangelog(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Changelog updated successfully",
        });
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update changelog",
          variant: "destructive",
        });
      },
    },
  );

  useEffect(() => {
    if (changelog) {
      setTitle(changelog.title);
      setDescription(changelog.description);
      setType(changelog.type);
      setReleaseDate(
        changelog.releaseDate
          ? format(new Date(changelog.releaseDate), "yyyy-MM-dd")
          : "",
      );
      setFeatures(changelog.changes.features || []);
      setFixes(changelog.changes.fixes || []);
      setImprovements(changelog.changes.improvements || []);
    }
  }, [changelog]);

  const handleSubmit = () => {
    if (!title) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    const changes = {
      features,
      fixes,
      improvements,
    };

    if (isEditMode && changelog) {
      updateChangelog({
        id: changelog.id,
        title,
        description,
        type,
        releaseDate: releaseDate || undefined,
        changes,
      });
    } else {
      createChangelog({
        title,
        description,
        type,
        releaseDate: releaseDate || undefined,
        changes,
      });
    }
  };

  const handleAddItem = (
    type: "feature" | "fix" | "improvement",
    value: string,
  ) => {
    if (!value.trim()) return;

    if (type === "feature") {
      setFeatures([...features, value.trim()]);
      setNewFeature("");
    } else if (type === "fix") {
      setFixes([...fixes, value.trim()]);
      setNewFix("");
    } else if (type === "improvement") {
      setImprovements([...improvements, value.trim()]);
      setNewImprovement("");
    }
  };

  const handleRemoveItem = (
    type: "feature" | "fix" | "improvement",
    index: number,
  ) => {
    if (type === "feature") {
      setFeatures(features.filter((_, i) => i !== index));
    } else if (type === "fix") {
      setFixes(fixes.filter((_, i) => i !== index));
    } else if (type === "improvement") {
      setImprovements(improvements.filter((_, i) => i !== index));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Changelog" : "Create Changelog"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details of this changelog"
              : "Enter the details for the new changelog"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Changelog title"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as ChangelogType)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FEATURE">Feature</SelectItem>
                <SelectItem value="BUGFIX">Bug Fix</SelectItem>
                <SelectItem value="SECURITY">Security</SelectItem>
                <SelectItem value="IMPROVEMENT">Improvement</SelectItem>
                <SelectItem value="BREAKING_CHANGE">Breaking Change</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="releaseDate" className="text-right">
              Release Date
            </Label>
            <Input
              id="releaseDate"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Describe this changelog"
              rows={4}
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Features</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a new feature"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddItem("feature", newFeature);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => handleAddItem("feature", newFeature)}
                >
                  Add
                </Button>
              </div>
              <div className="space-y-1">
                {features.map((feature, index) => (
                  <div
                    key={`feature-${index.toString()}`}
                    className="flex justify-between items-center bg-muted p-2 rounded"
                  >
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem("feature", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bug Fixes */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Bug Fixes</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newFix}
                  onChange={(e) => setNewFix(e.target.value)}
                  placeholder="Add a new bug fix"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddItem("fix", newFix);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => handleAddItem("fix", newFix)}
                >
                  Add
                </Button>
              </div>
              <div className="space-y-1">
                {fixes.map((fix, index) => (
                  <div
                    key={`fix-${index.toString()}`}
                    className="flex justify-between items-center bg-muted p-2 rounded"
                  >
                    <span>{fix}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem("fix", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Improvements */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Improvements</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newImprovement}
                  onChange={(e) => setNewImprovement(e.target.value)}
                  placeholder="Add a new improvement"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddItem("improvement", newImprovement);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => handleAddItem("improvement", newImprovement)}
                >
                  Add
                </Button>
              </div>
              <div className="space-y-1">
                {improvements.map((improvement, index) => (
                  <div
                    key={`improvement-${index.toString()}`}
                    className="flex justify-between items-center bg-muted p-2 rounded"
                  >
                    <span>{improvement}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem("improvement", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
          >
            {isEditMode
              ? isUpdating
                ? "Updating..."
                : "Update"
              : isCreating
              ? "Creating..."
              : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangelogForm;
