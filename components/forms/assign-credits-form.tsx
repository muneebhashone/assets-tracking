import React, { Dispatch, SetStateAction } from "react";
import { ModalCustom } from "../ModalComponent";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  AssignCreditsInputType,
  useAssignCredits,
} from "@/services/user.mutations";
import { toast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IUserModified } from "../tables/users-table/users";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
const creditValidationSchema = z.object({
  credits: z
    .string({ required_error: "This is required " })
    .min(1, "Value cannot be in negative")
    .transform(Number),
});
interface AssignCreditsFormSchema extends Omit<AssignCreditsInputType, "id"> {}

interface AssignCreditsFormProps {
  setOpenAssignCreditModal: Dispatch<SetStateAction<boolean>>;
  userData: IUserModified;
  openAssignCreditModal: boolean;
}

const AssignCreditForm = ({
  openAssignCreditModal,
  setOpenAssignCreditModal,
  userData,
}: AssignCreditsFormProps) => {
  const handleOnSubmit = (payload: AssignCreditsFormSchema) => {
    assignCredits({ id: userData.id, credits: Number(payload.credits) });
  };

  const form = useForm<AssignCreditsFormSchema>({
    resolver: zodResolver(creditValidationSchema),
  });
  const { control, handleSubmit } = form;
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
  return (
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
  );
};

export default AssignCreditForm;