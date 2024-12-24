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
import Link from "next/link";
import Image from "next/image";

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

  const { mutate: forgetPassword, isPending: isForgettingPassword } =
    useForgetPassword({
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
          <h1 className="text-4xl font-bold mb-6">Reset Your Password</h1>
          <p className="text-xl text-white/80 max-w-md">
            Don&apos;t worry! It happens. Please enter the email address
            associated with your account.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email address below to receive password reset
              instructions
            </p>
          </div>

          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(forgetPasswordHandler)}
            >
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        disabled={isForgettingPassword}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isForgettingPassword}
                className="w-full bg-[#3491fe] hover:bg-[#2b7ad8]"
              >
                {isForgettingPassword
                  ? "Sending Instructions..."
                  : "Send Instructions"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
