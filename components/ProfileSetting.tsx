"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChangePassword, useCurrentUser } from "@/services/auth.mutations";
import { UserRole } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PerSonalInformationForm from "./forms/personal-information-update-form";
import UploadProfileForm from "./forms/upload-profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,

} from "./ui/form";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";
import { Label } from "./ui/label";

const changePasswordFormSchema = z
  .object({
    newPassword: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(64, { message: "Password must be at most 64 characters long" }),
    currentPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(8, {
        message: "Confirm password must be at least 8 characters long",
      })
      .max(64, {
        message: "Confirm password must be at most 64 characters long",
      }),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(8, {
        message: "Confirm password must be at least 8 characters long",
      })
      .max(64, {
        message: "Confirm password must be at most 64 characters long",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password and Confirm password must match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormType = z.infer<typeof changePasswordFormSchema>;
const ProfileSetting = () => {
  const { push } = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { mutate: changePassword } = useChangePassword({
    onSuccess(data) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });
      push("/signin");
    },
    onError(error) {
      toast({
        title: error.response?.data.message,
        duration: 3000,
        variant: "destructive",
      });
    },
  });
  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  const { handleSubmit, control } = form;

  const handleChangePassword = (data: ChangePasswordFormType) => {
    changePassword(data);
  };
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div>
      <UploadProfileForm modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <div className="px-4 space-y-6 md:px-6 mb-8">
        <div className="flex items-center  flex-col">
          <div className="relative ">
            <Avatar className="w-[200px] h-[200px] cursor-pointer">
              <AvatarImage
                src={user?.user.avatar}
                onClick={() => setModalOpen(true)}
              />
              <AvatarFallback>{user?.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="rounded-full bg-white  absolute left-[70%] top-[70%] hover:text-blue-600 hover:bg-blue-50 cursor-pointer w-8 h-8 flex justify-center items-center">
              <Edit onClick={() => setModalOpen(true)} />{" "}
            </div>
          </div>

          <h1 className="text-2xl font-bold">{user?.user?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {!userLoading && UserRole[user?.user.role as keyof typeof UserRole]}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <PerSonalInformationForm />
          </div>

          <Separator />

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Change Password</h2>

            <Form {...form}>
              <form onSubmit={handleSubmit(handleChangePassword)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormField
                      control={control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="block text-xs mb-1">
                            Current Password
                          </Label>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter Current Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="block text-xs mb-1">
                            New Password
                          </Label>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter New Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="block text-xs mb-1">
                            Confirm Password
                          </Label>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Re-enter new Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <Button size="lg" className="bg-golden" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
