"use client";

import { useSetPassword } from "@/services/auth.mutations";
import { passwordValidation } from "@/utils/auth.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PasswordInput from "../PasswordInput";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";
import Link from "next/link";
import Image from "next/image";

export type SetPasswordFormType = z.infer<typeof setPasswordFormSchema>;
export const setPasswordFormSchema = z
  .object({
    password: passwordValidation("password"),
    confirmPassword: passwordValidation("confirm password"),
  })
  .refine((values) => values.confirmPassword === values.password, {
    message: "Password and confirm password must be same",
    path: ["confirmPassword"],
  });

const SetPasswordPage = ({ token }: { token?: string }) => {
  const { push } = useRouter();

  const form = useForm<SetPasswordFormType>({
    resolver: zodResolver(setPasswordFormSchema),
  });

  const { mutate: setPassword, isPending: isSettingPassword } = useSetPassword({
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
  const { control, handleSubmit } = form;

  const setPasswordHandler = (data: SetPasswordFormType) => {
    setPassword({
      token: String(token),
      ...data,
    });
  };
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
     
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-[#3491fe]" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href={"/"} className="hover:opacity-80 transition-opacity">
            <Image
              src={"/images/logo.png"}
              alt="logo"
              width={60}
              height={60}
              className="drop-shadow-xl"
            />
          </Link>
        </div>
        <div className="relative z-20 mt-20">
          <h1 className="text-4xl font-bold mb-6">Set Your Password</h1>
          <p className="text-xl text-white/80 max-w-md">
            Create a strong password to secure your account. Make sure it meets
            our security requirements.
          </p>
        </div>
      </div>

     
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Please set a secure password for your account
            </p>
          </div>

          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(setPasswordHandler)}
            >
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter your password"
                        disabled={isSettingPassword}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label>Confirm Password</Label>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm your password"
                        disabled={isSettingPassword}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSettingPassword}
                className="w-full bg-[#3491fe] hover:bg-[#2b7ad8]"
              >
                {isSettingPassword ? "Setting Password..." : "Set Password"}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Link
              href="/signin"
              className="text-sm text-[#3491FE] hover:underline"
            >
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;
