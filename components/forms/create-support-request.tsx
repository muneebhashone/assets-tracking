"use client";
import { useCreateSupportForm } from "@/services/admin/support.mutations";
import { useGetUsers } from "@/services/user.queries";
import { sanitizeObject } from "@/utils/common.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import validator from "validator";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

const createSupportFormSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phoneNo: z
      .string()
      .min(1)
      .refine(
        (value) => validator.isMobilePhone(value, "any", { strictMode: true }),
        "phoneNo must be valid",
      )
      .optional(),
    subject: z.string({ required_error: "subject is required" }).min(1),
    message: z.string({ required_error: "message is required" }).min(1),
    userId: z
      .string()
      .min(1)
      .refine((value) => validator.isNumeric(value), "userId must be valid")
      .optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!value?.userId) {
      const requiredFields = ["name", "email", "phoneNo"] as const;

      for (const field of requiredFields) {
        if (!value[field]) {
          ctx.addIssue({
            code: "custom",
            message: `${field} is required`,
            path: [field],
          });
        }
      }
    }
  });
type CreateSuppotFormSchemaType = z.infer<typeof createSupportFormSchema>;

const CreateSupportForm = () => {
  const form = useForm<CreateSuppotFormSchemaType>({
    resolver: zodResolver(createSupportFormSchema),
  });
  const { push } = useRouter();
  const { handleSubmit, control, reset } = form;
  const requestSupportHandler = (data: CreateSuppotFormSchemaType) => {
    createSupportForm(data);
  };

  const { data: users } = useGetUsers({
    filterByStatus: ["APPROVED"],
    filterByActive: true,
  });

  const { mutate: createSupportForm, isPending } = useCreateSupportForm({
    onSuccess(data) {
      toast({
        variant: "default",
        description: data.message,
        title: "Success",
      });
      push("/");
      reset();
    },
    onError(error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message,
        title: "Error",
      });
    },
  });
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Support Request</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Please fill out the form below to request support. Our team will get
        back to you as soon as possible.
      </p>

      <Form {...form}>
        <form onSubmit={handleSubmit(requestSupportHandler)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormField
                name="userId"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="userId" className="font-medium text-xs">
                      Users
                    </Label>
                    <FormControl>
                      <Select
                        onValueChange={field?.onChange}
                        value={String(field?.value)}
                      >
                        <SelectTrigger id="userId">
                          <SelectValue placeholder="Select User" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(users?.results) &&
                            users?.results.map((user) => {
                              return (
                                <SelectItem value={String(user.id)}>
                                  {user.name}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                name="name"
                control={control}
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <Label
                      htmlFor="name"
                      className="text-neutral-500 font-medium"
                    >
                      Name
                    </Label>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                name="email"
                control={control}
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <Label
                      htmlFor="email"
                      className="text-neutral-500 font-medium"
                    >
                      Email
                    </Label>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="Enter your email"
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                name="subject"
                control={control}
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <Label
                      htmlFor="subject"
                      className="text-neutral-500 font-medium"
                    >
                      Subject
                    </Label>
                    <FormControl>
                      <Input
                        id="subject"
                        placeholder="Enter subject "
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                name="message"
                control={control}
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <Label
                      htmlFor="message"
                      className="text-neutral-500 font-medium"
                    >
                      Message
                    </Label>
                    <FormControl>
                      <Input
                        id="message"
                        placeholder="Enter message here"
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                name="phoneNo"
                control={control}
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <Label
                      htmlFor="phoneNo"
                      className="text-neutral-500 font-medium"
                    >
                      Phone Number
                    </Label>
                    <FormControl>
                      <Input
                        id="phoneNo"
                        placeholder="Enter your phone number"
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button size="lg" className="mt-10 bg-golden" disabled={isPending}>
            Request
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateSupportForm;
