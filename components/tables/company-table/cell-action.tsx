"use client";
import CompanyUpdateForm from "@/components/forms/company-update-form";
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
import { useCurrentUser } from "@/services/auth.mutations";
import { useDeleteCompany } from "@/services/companies.mutations";
import { Company } from "@/services/companies.queries";
import { PermissionsType } from "@/types/user.types";
import { checkPermissions } from "@/utils/user.utils";

import { MoreHorizontal, Trash, Wrench } from "lucide-react";
import { useState } from "react";

interface CellActionProps {
  data: Company;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);

  const { mutate: deleteCompany, isPending: isDeletingCompany } =
    useDeleteCompany({
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
  const { data: currentUser } = useCurrentUser();

  return (
    <>
      <AlertModal
        loading={false}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteCompany({ id: data.id })}
      />
      <CompanyUpdateForm
        companyData={data}
        modalOpen={editModal}
        setModalOpen={setEditModal}
        key={data.id}
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
          {(currentUser?.user.role === "SUPER_ADMIN" ||
            checkPermissions(
              currentUser?.user.permissions as PermissionsType[],
              ["EDIT_COMPANY"],
            )) && (
            <DropdownMenuItem onClick={() => setEditModal(true)}>
              <Wrench className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
          )}
          {(currentUser?.user.role === "SUPER_ADMIN" ||
            checkPermissions(
              currentUser?.user.permissions as PermissionsType[],
              ["DELETE_COMPANY"],
            )) && (
            <DropdownMenuItem
              disabled={isDeletingCompany}
              onClick={() => setOpen(true)}
            >
              {isDeletingCompany ? (
                "Loading..."
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              Delete
            </DropdownMenuItem>
          )}
          {/* <DropdownMenuItem >
            <Trash className="mr-2 h-4 w-4" /> Details
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
