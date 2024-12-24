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
import { useLogin } from "@/services/auth.mutations";
import { passwordValidation } from "@/utils/auth.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import PasswordInput from "../PasswordInput";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Enter a valid email address" }),
  password: passwordValidation("password"),
  rememberMe: z.boolean().optional().default(false),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { mutate: loginUser, isPending } = useLogin({
    onSuccess(data) {
      toast({
        title: "Success",
        description: "Logged in successfully",
        variant: "default",
      });
      const tracksWith = searchParams.get("tracks-with");
      const containerNumber = searchParams.get("container-number");
      const mblNumber = searchParams.get("mbl-number");
      const carrier = searchParams.get("carrier");

      if (tracksWith && carrier && (containerNumber || mblNumber)) {
        const redirectUrl = new URL("/dashboard/shipment", window.location.origin);
        redirectUrl.searchParams.set("tracks-with", tracksWith);
        if (tracksWith === "CONTAINER_NUMBER" && containerNumber) {
          redirectUrl.searchParams.set("container-number", containerNumber);
        } else if (tracksWith === "MBL_NUMBER" && mblNumber) {
          redirectUrl.searchParams.set("mbl-number", mblNumber);
        }
        redirectUrl.searchParams.set("carrier", carrier);
        router.replace(redirectUrl.toString());
      } else {
        router.replace("/dashboard");
      }
    },
    onError(error) {
      toast({
        title: "Error",
        description: error.response?.data.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: UserFormValue) => {
    loginUser(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>Password</Label>
                <FormControl>
                  <PasswordInput {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-1">
                <FormControl>
                  <Input
                    type="checkbox"
                    className="w-4 h-4 mt-1"
                    {...field}
                    value={field.value ? "true" : "false"}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label>Remember me</Label>
                </div>
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            className="ml-auto w-full bg-[#D3991F] hover:bg-[#bf8c1e]"
            type="submit"
          >
            Login
          </Button>
        </form>
      </Form>
      <Link href="/forget-password" className="text-[#3491FE]">
        Forgot Password?
      </Link>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </>
  );
}
