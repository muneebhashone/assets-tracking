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
import { IUser } from "@/types/user.types";
import axios from "axios";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  data: IUser;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // const onConfirm = async (email: string) => {
  //   setLoading(true);
  //   const reject = await softDeleteUser(email);
  //   setOpen(false);
  //   router.refresh();
  //   setLoading(false);
  //   return reject;
  // };
  // const onAccept = async (email: string) => {
  //   setLoading(true);
  //   const { data: updateResponce } = await axios.post(
  //     `${process.env.NEXT_PUBLIC_SITE_URL as string}/api/admin/userStatus`,
  //     {
  //       email: email,
  //     },
  //   );
  //   router.refresh();
  //   setLoading(false);
  //   return updateResponce;
  // };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => console.log("here")}
        loading={loading}
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

          <DropdownMenuItem
            disabled={loading}
            // onClick={() => onAccept(data.email)}
          >
            <Edit className="mr-2 h-4 w-4" /> Approve
          </DropdownMenuItem>
          <DropdownMenuItem disabled={loading} onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
