"use client";

import { ModalCustom } from "@/components/ModalComponent";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useQueryUpdater from "@/hooks/useQueryUpdater";
import { useCurrentUser } from "@/services/auth.mutations";
import {
  AssignCreditsInputType,
  useAssignCredits,
  useDeleteUser,
  useToggleActive,
} from "@/services/user.mutations";
import { UserPermissions } from "@/types/services/auth.types";
import { checkPermissions } from "@/utils/user.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, MoreHorizontal, Package, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IUserModified } from "./users";
import { Label } from "@/components/ui/label";

interface CellActionProps {
  data: IUserModified;
}
const creditValidationSchema = z.object({
  credits: z

    .string({ required_error: "This is required " })
    .min(1, "Value cannot be in negative")
    .transform(Number),
});
interface AssignCreditsFormSchema extends Omit<AssignCreditsInputType, "id"> {}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [openAssignCreditModal, setOpenAssignCreditModal] = useState(false);
  const [modalWarning, setModalWarning] = useState(false);

  const { querySetter } = useQueryUpdater();
  const form = useForm<AssignCreditsFormSchema>({
    resolver: zodResolver(creditValidationSchema),
  });

  const { control, handleSubmit } = form;
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

  const { mutate: assignCredits } = useAssignCredits({
    onSuccess(data) {
      toast({
        variant: "default",
        description: data.message,
        title: "Success",
      });

      setOpenAssignCreditModal(false);
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
  const { data: user } = useCurrentUser();

  const handleOnSubmit = (payload: AssignCreditsFormSchema) => {
    assignCredits({ id: data.id, credits: Number(payload.credits) });
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
        onConfirm={() => deleteUser({ id: data.id })}
      />
      <ModalCustom
        isOpen={openAssignCreditModal}
        onClose={() => setOpenAssignCreditModal(false)}
      >
        <Form {...form}>
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="space-y-2">
              <FormField
                name="credits"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="credits"
                      className="text-neutral-500 font-medium"
                    >
                      Assign Credits
                    </Label>
                    <FormControl>
                      <Input
                        id="credits"
                        placeholder="Enter Credits"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="border rounded-md px-4 py-2 bg-[#D3991F] text-white hover:bg-zinc-900"
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </ModalCustom>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => querySetter("pe", `${data.id}`)}>
            <Package className="mr-2 h-4 w-4" /> Update Permissions
          </DropdownMenuItem>
          {data.isActive === "Active" ? (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="mr-2 h-4 w-4" /> Deactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => toggleActive({ id: data.id })}>
              <Edit className="mr-2 h-4 w-4" /> Activate
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setOpenAssignCreditModal(true)}>
            <Edit className="mr-2 h-4 w-4" /> Assign Credits
          </DropdownMenuItem>

          {checkPermissions(user?.user.permissions as UserPermissions[], [
            "DELETE_USER",
          ]) && (
            <DropdownMenuItem
              //  disabled={loading}
              onClick={() => setModalWarning(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
