import {
  AssignOrDeductCreditsInputType,
  useAssignOrDeductCredits,
} from "@/services/user.mutations";
import { User } from "@/types/services/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ModalCustom } from "../ModalComponent";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";
const creditValidationSchema = z.object({
  credits: z
    .string({ required_error: "This is required " })
    .min(1, "Value cannot be in negative")
    .transform(Number),
});
interface AssignOrDeductCreditsFormSchema
  extends Omit<AssignOrDeductCreditsInputType, "id"> {}

interface AssignOrDeductCreditsFormProps {
  setOpenAssignCreditModal: Dispatch<SetStateAction<boolean>>;
  userData: User;
  openAssignCreditModal: boolean;
  type: "assign" | "deduct";
}

const AssignOrDeductCreditForm = ({
  openAssignCreditModal,
  setOpenAssignCreditModal,
  userData,
  type,
}: AssignOrDeductCreditsFormProps) => {
  const handleOnSubmit = (payload: AssignOrDeductCreditsFormSchema) => {
    assignCredits({ id: userData.id, credits: Number(payload.credits), type });
  };

  const form = useForm<AssignOrDeductCreditsFormSchema>({
    resolver: zodResolver(creditValidationSchema),
  });
  const { control, handleSubmit } = form;
  const { mutate: assignCredits } = useAssignOrDeductCredits({
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

export default AssignOrDeductCreditForm;
