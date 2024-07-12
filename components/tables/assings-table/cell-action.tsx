"use client";

import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDeleteAssignment } from "@/services/admin/assigns.mutation";
import { AssignsType } from "@/services/admin/assigns.queries";
import { Trash } from "lucide-react";
import { useState } from "react";

interface CellActionProps {
  data: AssignsType;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteAssignment } = useDeleteAssignment({
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

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={false}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteAssignment({ assignmentId: data.id })}
      />
      <div className="w-full flex justify-center">
        <Button
          onClick={() => setOpen(true)}
          className="bg-transparent text-red-700 hover:bg-transparent hover:text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>

      {/* <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem>
           
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </>
  );
};
