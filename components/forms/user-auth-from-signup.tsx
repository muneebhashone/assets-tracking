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
import { useGetAllCompanies } from "@/hooks/useQuery";
import { createUserFormSchema } from "@/lib/form-schema";
import { CreateUserSchemaType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

export default function UserAuthFormSignUp() {
  const { toast } = useToast();
  // const searchParams = useSearchParams();
  const router = useRouter();
  const { data: companiesResponse, isFetching } = useGetAllCompanies();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateUserSchemaType) => {
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
  const defaultValues = {
    email: "",
    password: "",
    name: "",
    company: "",
  };
  const form = useForm<CreateUserSchemaType>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: CreateUserSchemaType) => {
    // console.log({ data });
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
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    disabled={isPending || isFetching}
                    {...field}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companiesResponse?.data?.map((company) => (
                        <SelectItem
                          key={company?.id}
                          value={String(company?.id)}
                        >
                          {company?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
