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
import { Shipment } from "@/services/shipment.queries";
import { MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";

interface CellActionProps {
  data: Shipment;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => statusChange({ id: data.id, status: "REJECTED" })}
        loading={loading}
      /> */}
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
          // disabled={loading}
          // onClick={() => statusChange({ id: data.id, status: "APPROVED" })}
          >
            <Link
              href={`/dashboard/shipment/${data.id}`}
              className="hover:text-blue-400"
            >
              View Details
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
          //  disabled={loading}
          //  onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
