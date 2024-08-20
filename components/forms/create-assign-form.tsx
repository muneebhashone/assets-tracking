"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { ModalCustom } from "../ModalComponent";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetUsers } from "@/services/user.queries";
import { useAssignUsers } from "@/services/admin/assigns.mutation";
import { toast } from "../ui/use-toast";

interface CreateAssignFormProps {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}
const createAssignFormSchema = z.object({
  childId: z.string().min(1),
  parentId: z.string().min(1),
});
type CreateAssignFormSchemaType = z.infer<typeof createAssignFormSchema>;

const CreateAssignForm = ({
  modalState,
  setModalState,
}: CreateAssignFormProps) => {
  const form = useForm<CreateAssignFormSchemaType>({
    resolver: zodResolver(createAssignFormSchema),
  });
  const { handleSubmit, control, reset } = form;
  const assignHandler = (data: CreateAssignFormSchemaType) => {
    assignUser(data);
  };

  const { data: subAdmins } = useGetUsers({
    filterByRole: "SUB_ADMIN",
    filterByStatus: ["APPROVED"],
    filterByActive: "true",
  });
  const { data: whiteLabel } = useGetUsers({
    filterByRole: "WHITE_LABEL_ADMIN",
    filterByStatus: ["APPROVED"],
    filterByActive: "true",
  });

  const { mutate: assignUser, isPending } = useAssignUsers({
    onSuccess(data) {
      toast({
        variant: "default",
        description: data.message,
        title: "Success",
      });
      reset();
      setModalState(false);
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
    <ModalCustom isOpen={modalState} onClose={() => setModalState(false)}>
      <Form {...form}>
        <form onSubmit={handleSubmit(assignHandler)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                name="parentId"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="parentId" className="font-medium text-xs">
                      Sub Admins
                    </Label>
                    <FormControl>
                      <Select
                        onValueChange={field?.onChange}
                        value={String(field?.value)}
                      >
                        <SelectTrigger id="parentId">
                          <SelectValue placeholder="Select Sub Admin" />
                        </SelectTrigger>
                        <SelectContent>
                          {Boolean(subAdmins?.results?.length) &&
                            subAdmins?.results?.map((subadmin, index) => {
                              return (
                                <SelectItem
                                  value={String(subadmin.id)}
                                  key={index}
                                >
                                  {subadmin.name}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                name="childId"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="childId" className="font-medium text-xs">
                      White Label Admins
                    </Label>
                    <FormControl>
                      <Select
                        onValueChange={field?.onChange}
                        value={String(field?.value)}
                      >
                        <SelectTrigger id="childId">
                          <SelectValue placeholder="Select White Label Admin" />
                        </SelectTrigger>
                        <SelectContent>
                          {Boolean(whiteLabel?.results?.length) &&
                            whiteLabel?.results?.map((whiteLabel, index) => {
                              return (
                                <SelectItem
                                  value={String(whiteLabel.id)}
                                  key={index}
                                >
                                  {whiteLabel.name}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button size="lg" className="mt-10 bg-golden" disabled={isPending}>
            Assign
          </Button>
        </form>
      </Form>
    </ModalCustom>
  );
};

export default CreateAssignForm;
