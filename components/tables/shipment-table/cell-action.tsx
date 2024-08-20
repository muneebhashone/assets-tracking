"use client";
import AdminUpdateShipmentForm from "@/components/forms/admin-update-shipment-form";
import UpdateShipmentForm from "@/components/forms/update-shipment-form";
import UploadShipmentFile from "@/components/forms/upload-shipment-file-form";
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
import {
  useBuildShipmentShareableLink,
  useDeletShipment,
  useDiscardShipmentShareableLink,
  useSetFilesShareable,
} from "@/services/shipment.mutations";
import { Shipment } from "@/services/shipment.queries";
import { PermissionsType } from "@/types/user.types";
import { checkPermissions } from "@/utils/user.utils";
import {
  ClipboardX,
  Cloud,
  Edit,
  ExternalLink,
  LinkIcon,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CellActionProps {
  data: Shipment;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [warningOpen, setWarningOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [adminUpdateModalOpen, setAdminUpdateModalOpen] =
    useState<boolean>(false);
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
  const { mutate: toggleFileShare } = useSetFilesShareable({
    onSuccess() {
      toast({
        variant: "default",
        description: `Sharing ${data.shareFiles ? "Disabled" : "Enabled"} `,
        title: "Success",
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message,
        title: "Error",
      });
    },
  });
  const { mutate: createLink } = useBuildShipmentShareableLink({
    async onSuccess(data) {
      toast({
        variant: "default",
        description: "Link generated and copied to clipboard",
        title: "Success",
      });

      await navigator.clipboard.writeText(data.data.shareableLink);
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

  const { mutate: discardLink } = useDiscardShipmentShareableLink({
    onSuccess(data) {
      toast({
        variant: "default",
        description: "Share link discarded",
        title: "Success",
      });
      // setShareableLink(null);
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

  return (
    <>
      <AlertModal
        isOpen={warningOpen}
        onClose={() => setWarningOpen(false)}
        onConfirm={() => deleteShipment({ id: data.id })}
        loading={false}
      />
      <UploadShipmentFile
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        shipmentId={data.id}
      />

      <UpdateShipmentForm
        setModalOpen={setUpdateModalOpen}
        modalOpen={updateModalOpen}
        shipmentData={data}
      />
      <AdminUpdateShipmentForm
        setModalOpen={setAdminUpdateModalOpen}
        modalOpen={adminUpdateModalOpen}
        shipmentData={data}
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
              "VIEW_SHIPMENT",
            ])) && (
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
          )}

          <DropdownMenuItem onClick={() => setWarningOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>

          {(user?.user.role === "SUPER_ADMIN" ||
            checkPermissions(user?.user.permissions as PermissionsType[], [
              "EDIT_SHIPMENT",
              "CREATE_SHIPMENT",
              "DELETE_SHIPMENT",
            ])) && (
            <DropdownMenuItem
              onClick={() =>
                toggleFileShare({
                  filesShareable: !data.shareFiles,
                  shipmentId: data.id,
                })
              }
            >
              {data.shareFiles ? (
                <>
                  <ToggleRight className="mr-2 h-4 w-4" /> Disable File Share
                </>
              ) : (
                <>
                  <ToggleLeft className="mr-2 h-4 w-4" /> Enable File Share
                </>
              )}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => setModalOpen(true)}>
            <Cloud className="mr-2 h-4 w-4" /> Upload File
          </DropdownMenuItem>
          {user?.user.role === "SUPER_ADMIN" ? (
            <DropdownMenuItem onClick={() => setAdminUpdateModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Update Shipment
            </DropdownMenuItem>
          ) : (
            checkPermissions(user?.user.permissions as PermissionsType[], [
              "EDIT_SHIPMENT",
            ]) && (
              <DropdownMenuItem onClick={() => setUpdateModalOpen(true)}>
                <Edit className="mr-2 h-4 w-4" /> Update Shipment
              </DropdownMenuItem>
            )
          )}

          {(user?.user.role === "SUPER_ADMIN" ||
            checkPermissions(user?.user.permissions as PermissionsType[], [
              "EDIT_SHIPMENT",
              "CREATE_SHIPMENT",
              "DELETE_SHIPMENT",
            ])) &&
            (data.shareToken ? (
              <DropdownMenuItem
                onClick={() => discardLink({ shipmentId: String(data.id) })}
              >
                <ClipboardX className="mr-2 h-4 w-4" /> Discard Shareable Link
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => createLink({ shipmentId: String(data.id) })}
              >
                <LinkIcon className="mr-2 h-4 w-4" /> Generate Sharable Link
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
