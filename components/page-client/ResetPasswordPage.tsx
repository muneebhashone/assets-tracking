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

  const { mutate: resetPassword } = useResetPassword({
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
    <main className="antialiased bg-[#3492fea1] text-gray-900 font-sans">
      <div className="flex items-center h-screen w-full">
        <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
          <span className="block w-full text-xl uppercase font-bold mb-4">
            Enter New Password
          </span>
          <Form {...form}>
            <form
              className="mb-4"
              onSubmit={handleSubmit(resetPasswordHandler)}
            >
              <div className="mb-6 md:w-full">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-xs mb-1">Password</Label>
                      <FormControl>
                        <PasswordInput
                          className="w-full border rounded p-2 outline-none focus:shadow-outline"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                type="submit"
                className="bg-[#D3991F] hover:bg-[#bf8c1e] text-white uppercase text-sm font-semibold px-4 py-2 rounded"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
