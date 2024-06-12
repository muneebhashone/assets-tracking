"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/services/auth.mutations";
import { AUTH_KEY } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Enter a valid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must contain atleast 8 characters")
    .max(64, "Password should not be more than 64 characters"),
});

type UserFormValue = z.infer<typeof formSchema>;

const initialValues = {
  email: "",
  password: "",
};

export default function UserAuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: loginUser, isPending } = useLogin({
    onSuccess(data) {

      toast({
        title: "Success",
        description: "Logged in successfully",
        variant: "default",
      });
      router.push("/dashboard");
    },
    onError(error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.response?.data.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
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
                <FormLabel>Email</FormLabel>
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            className="ml-auto w-full bg-[#D3991F]"
            type="submit"
          >
            Login
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </>
  );
}
