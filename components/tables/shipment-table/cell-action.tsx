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
import { useDeletShipment } from "@/services/shipment.mutations";
import { Shipment } from "@/services/shipment.queries";
import { ExternalLink, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CellActionProps {
  data: Shipment;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [warningOpen, setWarningOpen] = useState<boolean>(false);
  const { mutate: deleteShipment } = useDeletShipment({
    onSuccess(data) {
      toast({
        variant: "default",
        description: data.message,
        title: "Success",
      });

      setWarningOpen(false);
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
        isOpen={warningOpen}
        onClose={() => setWarningOpen(false)}
        onConfirm={() => deleteShipment({ id: data.id })}
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

          <DropdownMenuItem>
            <Link
              href={`/dashboard/shipment/${data.id}`}
              className="hover:text-blue-400"
            >
              <div className="flex">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Details
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setWarningOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
