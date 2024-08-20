"use client";

import { useCreateUser } from "@/services/user.mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { ModalCustom } from "../ModalComponent";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { EligibleRolesForCreation, UserRole } from "@/utils/constants";
import { useCurrentUser } from "@/services/auth.mutations";
import { Button } from "../ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";

interface UserCreateFormProps {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}

export type CreateUserFormSchemaType = z.infer<typeof createUserSchema>;

const createUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required field" })
    .email({ message: "Is not a valid email" }),
  name: z.string({ required_error: "Name field is required" }),
  role: z.string({
    required_error: "Please Select the role you want to create",
  }),
});
const UserCreateForm = ({ modalState, setModalState }: UserCreateFormProps) => {
  const { mutate, isPending } = useCreateUser({
    onSuccess(data) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });
      setModalState(false);
      form.reset();
    },
    onError(error) {
      toast({
        title: error.response?.data.message,
        duration: 3000,
        variant: "default",
      });
    },
  });
  const { data: currentUser, isLoading: selfLoading } = useCurrentUser();
  const form = useForm<CreateUserFormSchemaType>({
    resolver: zodResolver(createUserSchema),
  });
  const { control, handleSubmit } = form;

  const onSubmit = (data: CreateUserFormSchemaType) => {
    mutate(data);
  };
  return (
    <ModalCustom
      isOpen={modalState}
      onClose={() => setModalState(false)}
      className=" overflow-auto min-w-[40rem]  backdrop-opacity-50"
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex  w-full items-center justify-center ">
            <Card className="w-full max-w-xl border-0 shadow-none">
              <CardHeader>
                <CardTitle className=" font-semibold text-xl text-zinc-700">
                  Create User
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 ">
                <div className="space-y-2">
                  <FormField
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="email"
                          className="text-neutral-500 font-medium"
                        >
                          Email
                        </Label>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email here"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="name"
                          className="text-neutral-500 font-medium"
                        >
                          Name
                        </Label>
                        <FormControl>
                          <Input
                            id="name"
                            type="name"
                            placeholder="Enter name here"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2 w-[100%]">
                  <FormField
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="role"
                          className="text-neutral-500 font-medium"
                        >
                          Role
                        </Label>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            // disabled={isPending || isFetching}
                            {...field}
                          >
                            <SelectTrigger id="role">
                              <SelectValue placeholder="Select a Role from the list" />
                            </SelectTrigger>
                            <SelectContent className="overflow-y-auto max-h-[10rem]">
                              {EligibleRolesForCreation?.[
                                currentUser?.user
                                  ?.role as keyof typeof EligibleRolesForCreation
                              ]?.map((role, index) => {
                                return (
                                  <SelectItem
                                    value={role}
                                    key={index}
                                    disabled={selfLoading}
                                  >
                                    {UserRole[role as keyof typeof UserRole]}
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
              </CardContent>
              <CardFooter className="w-full justify-end ">
                <Button
                  type="submit"
                  className="w-[25%] border-r-4 bg-golden"
                  disabled={isPending}
                >
                  <span className="mr-2">Create</span>
                  <PlusCircledIcon />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </ModalCustom>
  );
};

export default UserCreateForm;
