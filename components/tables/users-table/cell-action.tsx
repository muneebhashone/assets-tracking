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
import {
  useAdminDeleteUser
} from "@/services/admin/user.mutations";
import { useCurrentUser } from "@/services/auth.mutations";
import {
  useDeleteUser,
  useToggleActive
} from "@/services/user.mutations";
import { PermissionsType } from "@/types/user.types";
import { checkPermissions } from "@/utils/user.utils";
import {
  CheckCircle,
  Edit,
  Edit2,
  MoreHorizontal,
  Package,
  Trash,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { IUserModified } from "./users";

interface CellActionProps {
  data: IUserModified;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [openAssignCreditModal, setOpenAssignCreditModal] = useState(false);
  const [modalWarning, setModalWarning] = useState<boolean>(false);
  const [adminModalState, setAdminModalState] = useState<boolean>(false);

  const { querySetter } = useQueryUpdater();

  const { mutate: toggleActive } = useToggleActive({
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
  const {
    avatar,
    password,
    passwordResetToken,
    setPasswordToken,
    ...updateData
  } = data;
  const userUpdateData = {
    ...updateData,
    id: String(data.id),
    clientId: data.role === "CLIENT_USER" ? String(data.clientId) : undefined,
    companyId: String(data.companyId),
    isActive: data.isActive === "Active" ? true : false,
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={false}
        onClose={() => setOpen(false)}
        onConfirm={() => toggleActive({ id: data.id })}
      />

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
        userData={userUpdateData}
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
          {checkPermissions(user?.user.permissions as PermissionsType[], [
            "UPDATE_PERMISSIONS",
          ]) && (
            <DropdownMenuItem onClick={() => querySetter("pe", `${data.id}`)}>
              <Package className="mr-2 h-4 w-4" /> Update Permissions
            </DropdownMenuItem>
          )}
          {data.isActive === "Active" ? (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <XCircle className="mr-2 h-4 w-4" />
              Deactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => toggleActive({ id: data.id })}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Activate
            </DropdownMenuItem>
          )}
          {checkPermissions(user?.user.permissions as PermissionsType[], [
            "ASSIGN_CREDITS",
          ]) && (
            <DropdownMenuItem onClick={() => setOpenAssignCreditModal(true)}>
              <Edit className="mr-2 h-4 w-4" /> Assign Credits
            </DropdownMenuItem>
          )}
          {user?.user.role === "SUPER_ADMIN" && (
            <DropdownMenuItem onClick={() => setAdminModalState(true)}>
              <Edit2 className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
          )}
          {checkPermissions(user?.user.permissions as PermissionsType[], [
            "DELETE_USER",
          ]) && (
            <DropdownMenuItem onClick={() => setModalWarning(true)}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
