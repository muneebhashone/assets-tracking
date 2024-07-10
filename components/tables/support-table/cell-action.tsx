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
import {
  useDeleteSupportForm,
  useResolveSupportForm,
} from "@/services/admin/support.mutations";
import { SupportType } from "@/services/admin/support.queries";
import {
  Link as LinkIcon,
  MoreHorizontal,
  Paperclip,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CellActionProps {
  data: SupportType;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [resolveAlertOpen, setResolveAlertOpen] = useState<boolean>(false);

  const { mutate: deleteSupportForm } = useDeleteSupportForm({
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
  });
  const { mutate: resolveForm } = useResolveSupportForm({
    onSuccess(data) {
      toast({
        variant: "default",
        description: data.message,
        title: "Success",
      });
      setResolveAlertOpen(false);
    },
    onError(error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message,
        title: "Error",
      });
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={false}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteSupportForm({ id: data.id })}
      />
      <AlertModal
        isOpen={resolveAlertOpen}
        loading={false}
        onClose={() => setOpen(false)}
        onConfirm={() => resolveForm({ id: data.id })}
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

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setResolveAlertOpen(true)}>
            <Paperclip className="mr-2 h-4 w-4" /> Resolve Ticket
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/dashboard/support/${data.id}`} className="flex">
              <LinkIcon className="mr-2 h-4 w-4" /> View
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
