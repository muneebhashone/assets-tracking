"use client";

import AdminUpdateUserForm from "@/components/forms/admin-update-user-form";
import AssignCreditForm from "@/components/forms/assign-credits-form";
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
import useQueryUpdater from "@/hooks/useQueryUpdater";
import { useAdminDeleteUser } from "@/services/admin/user.mutations";
import { useCurrentUser } from "@/services/auth.mutations";
import { useDeleteUser } from "@/services/user.mutations";
import { User } from "@/types/services/auth.types";
import { PermissionsType } from "@/types/user.types";
import { checkPermissions } from "@/utils/user.utils";
import { Edit, Edit2, MoreHorizontal, Package, Trash } from "lucide-react";
import { useState } from "react";

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [openAssignCreditModal, setOpenAssignCreditModal] = useState(false);
  const [modalWarning, setModalWarning] = useState<boolean>(false);
  const [adminModalState, setAdminModalState] = useState<boolean>(false);

  const { querySetter } = useQueryUpdater();

  const { mutate: deleteUser } = useDeleteUser({
    onSuccess(data) {
      toast({
        variant: "default",
        description: data.message,
        title: "Success",
      });

      setModalWarning(false);
    },
    onError(error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message,
        title: "Error",
      });
    },
  });
  const { mutate: adminDeleteUser } = useAdminDeleteUser({
    onSuccess(data) {
      toast({
        variant: "default",
        description: data.message,
        title: "Success",
      });

      setModalWarning(false);
    },
    onError(error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message,
        title: "Error",
      });
    },
  });

  const { data: user } = useCurrentUser();

  const deleteUserHandler = () => {
    user?.user.role === "SUPER_ADMIN"
      ? deleteUser({ id: data.id })
      : adminDeleteUser({ id: data.id });
  };

  return (
    <>
      <AlertModal
        isOpen={modalWarning}
        loading={false}
        onClose={() => setModalWarning(false)}
        onConfirm={deleteUserHandler}
      />
      <AssignCreditForm
        openAssignCreditModal={openAssignCreditModal}
        setOpenAssignCreditModal={setOpenAssignCreditModal}
        userData={data}
      />
      <AdminUpdateUserForm
        modalState={adminModalState}
        setModalState={setAdminModalState}
        userData={data}
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
          {(user?.user.role === "SUPER_ADMIN" ||
            checkPermissions(user?.user.permissions as PermissionsType[], [
              "UPDATE_PERMISSIONS",
            ])) && (
            <DropdownMenuItem onClick={() => querySetter("pe", `${data.id}`)}>
              <Package className="mr-2 h-4 w-4" /> Update Permissions
            </DropdownMenuItem>
          )}

          {(user?.user.role === "SUPER_ADMIN" ||
            checkPermissions(user?.user.permissions as PermissionsType[], [
              "ASSIGN_CREDITS",
            ])) && (
            <DropdownMenuItem onClick={() => setOpenAssignCreditModal(true)}>
              <Edit className="mr-2 h-4 w-4" /> Assign Credits
            </DropdownMenuItem>
          )}
          {user?.user.role === "SUPER_ADMIN" && (
            <DropdownMenuItem onClick={() => setAdminModalState(true)}>
              <Edit2 className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
          )}
          {(user?.user.role === "SUPER_ADMIN" ||
            checkPermissions(user?.user.permissions as PermissionsType[], [
              "DELETE_USER",
            ])) && (
            <DropdownMenuItem onClick={() => setModalWarning(true)}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
