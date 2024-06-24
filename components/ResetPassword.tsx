"use client";

import { useResetPassword } from "@/services/auth.mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

export type ResetPasswordFormType = z.infer<typeof resetPasswordFormType>;
export const resetPasswordFormType = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(64, { message: "Password must be at most 64 characters long" }),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(8, {
        message: "Confirm password must be at least 8 characters long",
      })
      .max(64, {
        message: "Confirm password must be at most 64 characters long",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm password must match",
    path: ["confirmPassword"],
  });

const ResetPassword = ({ token }: { token?: string }) => {
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
                      <FormLabel className="block text-xs mb-1">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
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
                      <FormLabel className="block text-xs mb-1">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
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
                className="bg-[#D3991F] hover:bg-[#f8cd71] text-white uppercase text-sm font-semibold px-4 py-2 rounded"
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

export default ResetPassword;
