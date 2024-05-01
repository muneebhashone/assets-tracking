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
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";
const formSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "Enter a valid email address" }),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "atleast 8 digit long" })
    .max(12, { message: "atmost is 12 digit" }),
  name: z.string({ required_error: "name is required" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthFormSignUp() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: UserFormValue) => {
      const { data: responseData } = await axios.post(
        "/api/user/create_user",
        data,
      );
      return responseData;
    },
    onSuccess(data, variables, context) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "destructive",
      });
      router.push("/signin");
    },
    onError(error, variables, context) {
      toast({
        //@ts-expect-error
        title: error.response.data.message,
        duration: 2000,
        variant: "destructive",
      });
    },
  });
  const defaultValues = {
    email: "",
    password: "",
    name: "",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    mutate(data);
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
                    placeholder="Enter your pass..."
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your name..."
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} className="ml-auto w-full bg-[#D3991F]" type="submit">
            submit
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        {/* <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div> */}
      </div>
      {/* <GoogleSignInButton /> */}
    </>
  );
}
