"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword, useCurrentUser } from "@/services/auth.mutations";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const changePasswordFormSchema = z.object({
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
});

type ChangePasswordFormType = z.infer<typeof changePasswordFormSchema>;
const ProfileSetting = () => {
  const { push } = useRouter();
  const { data: user } = useCurrentUser();
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

  return (
    <div>
      <div className="px-4 space-y-6 md:px-6 mb-8">
        <div className="flex items-center  flex-col">
          <Image
            src="/placeholder.svg"
            alt="Avatar"
            width={200}
            height={200}
            className="border rounded-full mb-2"
          />

          <h1 className="text-2xl font-bold">Catherine Grant</h1>
          <p className="text-gray-500 dark:text-gray-400">Product Designer</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  defaultValue="Catherine Grant"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" type="email" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter your phone" type="tel" />
              </div>
            </div>
          </div>
          <Button size="lg" className="mt-10 bg-golden">
            Save
          </Button>
          <Separator />
          {(user?.user.role === "WHITE_LABEL_ADMIN" ||
            user?.user.role === "WHITE_LABEL_SUB_ADMIN") && (
            <>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Company Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      defaultValue="Catherine Grant"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone"
                      type="tel"
                    />
                  </div>
                </div>
              </div>
              <Button size="lg" className="mt-10 bg-golden">
                Save
              </Button>
              <Separator />
            </>
          )}
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
                          <FormLabel className="block text-xs mb-1">
                            Current Password
                          </FormLabel>
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
                          <FormLabel className="block text-xs mb-1">
                            New Password
                          </FormLabel>
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
                </div>
                <div className="mt-8">
                  <Button size="lg" className="bg-golden" type="submit">
                    Save
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
