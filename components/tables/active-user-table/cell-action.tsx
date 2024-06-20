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
import { Edit, MoreHorizontal, Trash, Package } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { IUserModified } from "./active-user";
import useQueryUpdater from "@/hooks/useQueryUpdater";
import {
  AssignCreditsInputType,
  useAssignCredits,
  useToggleActive,
} from "@/services/user.mutations";
import { toast } from "@/components/ui/use-toast";
import { ModalCustom } from "@/components/ModalComponent";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAssignCreditModal, setOpenAssignCreditModal] = useState(false);
  const searchParams = useSearchParams();

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
  const handleOnSubmit = (payload: AssignCreditsFormSchema) => {
    assignCredits({ id: data.id, credits: Number(payload.credits) });
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => toggleActive({ id: data.id })}
        loading={loading}
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
                    <FormLabel
                      htmlFor="credits"
                      className="text-neutral-500 font-medium"
                    >
                      Assign Credits
                    </FormLabel>
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
                Create
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
          <DropdownMenuItem
            disabled={loading}
            onClick={() => querySetter("pe", `${data.id}`)}
          >
            <Package className="mr-2 h-4 w-4" /> Update Permissions
          </DropdownMenuItem>
          {data.isActive === "Active" ? (
            <DropdownMenuItem disabled={loading} onClick={() => setOpen(true)}>
              <Trash className="mr-2 h-4 w-4" /> Deactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={loading}
              onClick={() => toggleActive({ id: data.id })}
            >
              <Edit className="mr-2 h-4 w-4" /> Activate
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            disabled={loading}
            onClick={() => setOpenAssignCreditModal(true)}
          >
            <Edit className="mr-2 h-4 w-4" /> Assign Credits
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
