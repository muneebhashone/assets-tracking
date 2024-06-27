"use client";

import { useSetPassword } from "@/services/auth.mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { Label } from "./ui/label";

export type SetPasswordFormType = z.infer<typeof setPasswordFormSchema>;
export const setPasswordFormSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(32, { message: "Password must be at most 32 characters long" }),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(8, {
        message: "Confirm password must be at least 8 characters long",
      })
      .max(32, {
        message: "Confirm password must be at most 32 characters long",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm password must match",
    path: ["confirmPassword"],
  });

const SetPassword = ({ token }: { token?: string }) => {
  const { push } = useRouter();

  const form = useForm<SetPasswordFormType>({
    resolver: zodResolver(setPasswordFormSchema),
  });

  const { mutate: setPassword } = useSetPassword({
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
    <main className="antialiased bg-[#3492fea1] text-gray-900 font-sans">
      <div className="flex items-center h-screen w-full">
        <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
          <span className="block w-full text-xl uppercase font-bold mb-4">
            Set Password
          </span>
          <Form {...form}>
            <form className="mb-4" onSubmit={handleSubmit(setPasswordHandler)}>
              <div className="mb-6 md:w-full">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-xs mb-1">Password</Label>
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
                      <Label className="block text-xs mb-1">
                        Confirm Password
                      </Label>
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

export default SetPassword;
