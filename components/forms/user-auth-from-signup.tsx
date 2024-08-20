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
import { CreateUserFormSchema, createUserFormSchema } from "@/lib/form-schema";
import { useRegisterUser } from "@/services/auth.mutations";
import { useGetCompanies } from "@/services/companies.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import PasswordInput from "../PasswordInput";

const LIMIT = 100;
const PAGE = 0;

export default function UserAuthFormSignUp() {
  const { toast } = useToast();
  const router = useRouter();

  const { mutate, isPending } = useRegisterUser({
    onSuccess(data, variables, context) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });
      router.push("/signin");
    },
    onError(error, variables, context) {
      if (error instanceof Error) {
        toast({
          title: error?.response?.data.message,
          duration: 2000,
          variant: "destructive",
        });
      }
    },
  });

  const form = useForm<CreateUserFormSchema>({
    resolver: zodResolver(createUserFormSchema),
  });

  const onSubmit = async (data: CreateUserFormSchema) => {
    const { companyId } = data;
    mutate({ ...data, companyId: String(companyId) });
  };

  const { data, isFetching } = useGetCompanies({
    limitParam: LIMIT,
    pageParam: PAGE,
    searchString: "",
  });
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
                  <PasswordInput
                    disabled={isPending}
                    placeholder="Enter your pass..."
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
                <Label>Name</Label>
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
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <Label>Company</Label>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    disabled={isPending || isFetching}
                    {...field}
                    value={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your company" />
                    </SelectTrigger>
                    <SelectContent>
                      {data?.results?.map((company) => (
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
