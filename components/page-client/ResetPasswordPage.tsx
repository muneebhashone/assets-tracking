"use client";

import { useResetPassword } from "@/services/auth.mutations";
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

export type ResetPasswordFormType = z.infer<typeof resetPasswordFormType>;
export const resetPasswordFormType = z
  .object({
    password: passwordValidation("password"),
    confirmPassword: passwordValidation("confirm password"),
  })
  .refine((values) => values.confirmPassword === values.password, {
    message: "Password and confirm password must be same",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = ({ token }: { token?: string }) => {
  const { push } = useRouter();

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordFormType),
  });

  const { mutate: resetPassword, isPending: isResettingPassword } =
    useResetPassword({
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

  const resetPasswordHandler = (data: ResetPasswordFormType) => {
    resetPassword({
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
          <h1 className="text-4xl font-bold mb-6">Create New Password</h1>
          <p className="text-xl text-white/80 max-w-md">
            Your new password must be different from previously used passwords
            and meet our security requirements.
          </p>
        </div>
      </div>

    
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Please enter your new password below
            </p>
          </div>

          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(resetPasswordHandler)}
            >
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <FormControl>
                      <PasswordInput
                        className="w-full border rounded p-2 outline-none focus:shadow-outline"
                        disabled={isResettingPassword}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mb-6 md:w-full">
                <FormField
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-xs mb-1">
                        Confirm Password
                      </Label>
                      <FormControl>
                        <PasswordInput
                          className="w-full border rounded p-2 outline-none focus:shadow-outline"
                          placeholder="Re-Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                disabled={isResettingPassword}
                type="submit"
                className="bg-[#D3991F] hover:bg-[#bf8c1e] text-white uppercase text-sm font-semibold px-4 py-2 rounded"
              >
                {isResettingPassword ? "Loading..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
