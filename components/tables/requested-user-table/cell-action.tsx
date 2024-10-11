"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useUpdateStatus } from "@/services/user.mutations";
import { User } from "@/types/services/auth.types";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  const { mutate: statusChange, isPending: isUpdatingStatus } = useUpdateStatus(
    {
      onSuccess(data) {
        toast({
          variant: "default",
          description: data.message,
          title: "Success",
        });
        setOpen(false);
      },
      onError(error) {
        toast({
          variant: "destructive",
          description: error.response?.data.message,
          title: "Error",
        });
      },
    },
  );

  // };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => statusChange({ id: data.id, status: "REJECTED" })}
        loading={false}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {(data.status === "REJECTED" || data.status === "REQUESTED") && (
            <DropdownMenuItem
              disabled={isUpdatingStatus}
              onClick={() => statusChange({ id: data.id, status: "APPROVED" })}
            >
              <Edit className="mr-2 h-4 w-4" /> Approve
            </DropdownMenuItem>
          )}
          {(data.status === "APPROVED" || data.status === "REQUESTED") && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="mr-2 h-4 w-4" /> Reject
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
