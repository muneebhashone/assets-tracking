"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useForgetPassword } from "@/services/auth.mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "../ui/label";

export type forgetPasswordFormType = z.infer<typeof forgetPasswordSchema>;
export const forgetPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Not a valid email type" }),
});

const ForgetPasswordPage = ({ token }: { token?: string }) => {
  const { push } = useRouter();

  const form = useForm<forgetPasswordFormType>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const { mutate: forgetPassword } = useForgetPassword({
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

  const forgetPasswordHandler = (data: forgetPasswordFormType) => {
    forgetPassword(data);
  };
  return (
    <main className="antialiased bg-[#3492fea1] text-gray-900 font-sans">
      <div className="flex items-center h-screen w-full">
        <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
          <span className="block w-full text-xl uppercase font-bold mb-4">
            Forgot Password?
          </span>
          <Form {...form}>
            <form
              className="mb-4"
              onSubmit={handleSubmit(forgetPasswordHandler)}
            >
              <div className="mb-6 md:w-full">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-xs mb-1">Email</Label>
                      <FormControl>
                        <Input
                          type="email"
                          className="w-full border rounded p-2 outline-none focus:shadow-outline"
                          placeholder="Enter your email address"
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

export default ForgetPasswordPage;
