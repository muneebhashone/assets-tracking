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
import { createAdminCompanySchema } from "@/lib/form-schema";
import { useCreateAdminCompany } from "@/services/companies.mutations";
import {
  createCompanyInputType,
  useGetParentCompanies,
} from "@/services/companies.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import PasswordInput from "../PasswordInput";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

export default function AdminCompanyCreateForm({
  redirect = true,
  closeModal,
}: {
  redirect?: boolean;
  closeModal?: () => void;
}) {
  const { toast } = useToast();

  const router = useRouter();

  const { mutate, isPending } = useCreateAdminCompany({
    onSuccess(data, variables, context) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });
      closeModal?.();
      redirect && router.push("/signin");
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

  const form = useForm<createCompanyInputType>({
    resolver: zodResolver(createAdminCompanySchema),
  });

  const { data: parentCompanies } = useGetParentCompanies();

  const onSubmit = async (data: createCompanyInputType) => {
    if (data.type === "WHITE_LABEL") {
      data.parentCompany = undefined;
    }

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
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <Label>Company Name</Label>
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <Label>Company Type</Label>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Client</SelectItem>
                      <SelectItem value="WHITE_LABEL">White Label</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("type") === "CLIENT" && (
            <FormField
              control={form.control}
              name="parentCompany"
              render={({ field }) => (
                <FormItem>
                  <Label>Parent Company</Label>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent company" />
                      </SelectTrigger>
                      <SelectContent>
                        {parentCompanies?.data?.map((company) => (
                          <SelectItem
                            key={company.id}
                            value={company.id.toString()}
                          >
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <Label>Country</Label>
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
                <Label>City</Label>
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
                <Label>Admin Name</Label>
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
            className="ml-auto w-full bg-[#D3991F] hover:bg-[#bf8c1e]"
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
      </div>
    </>
  );
}
