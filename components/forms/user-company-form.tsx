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
import { createCompanySchema } from "@/lib/form-schema";
import { CreateCompanySchemaType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";

export default function CompanyAuthFormSignUp() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: CreateCompanySchemaType) => {
      const { data: responseData } = await axios.post("/api/company", data);
      return responseData;
    },
    onSuccess(data, variables, context) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
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
  const defaultValues = {};
  const form = useForm<CreateCompanySchemaType>({
    resolver: zodResolver(createCompanySchema),
    defaultValues,
  });

  const onSubmit = async (data: CreateCompanySchemaType) => {
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
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter company name..."
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
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter company country..."
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter company city..."
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
                <FormLabel>Admin Name</FormLabel>
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
          <Button
            disabled={isPending}
            className="ml-auto w-full bg-[#D3991F]"
            type="submit"
          >
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
