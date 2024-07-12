"use client";
import { useCreateSupportForm } from "@/services/admin/support.mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Textarea } from "../ui/textarea";

import { User } from "@/types/services/auth.types";
import PhoneInput from "react-phone-input-2";
import { toast } from "../ui/use-toast";
import "react-phone-input-2/lib/style.css";
import { handlePhoneNumber } from "@/utils/common.utils";

const createSupportFormSchema = z
  .object({
    name: z.string({ message: "Enter Name" }).min(1).optional(),
    email: z
      .string({ message: "Enter Your Subject" })
      .email({ message: "Invalid Email" })
      .optional(),
    phoneNo: z
      .string({ message: "Enter Phone Number" })
      .min(1)
      .refine(
        (value) => validator.isMobilePhone(value, "any", { strictMode: true }),
        "Phone Number must be valid",
      )
      .optional(),
    subject: z.string({ required_error: "Enter Subject" }).min(1),
    message: z.string({ required_error: "Enter Message" }).min(1),
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
            message: `Enter ${field}`,
            path: [field],
          });
        }
      }
    }
  });
type CreateSuppotFormSchemaType = z.infer<typeof createSupportFormSchema>;

interface CreateSupportFormProps {
  currentUser?: User;
}

const CreateSupportForm = ({ currentUser }: CreateSupportFormProps) => {
  const form = useForm<CreateSuppotFormSchemaType>({
    resolver: zodResolver(createSupportFormSchema),
    defaultValues: {
      userId: currentUser?.id ? String(currentUser?.id) : undefined,
    },
  });
  const { push } = useRouter();
  const { handleSubmit, control, reset, register } = form;
  const requestSupportHandler = (data: CreateSuppotFormSchemaType) => {
    createSupportForm(data);
  };

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
          <div className=" flex flex-col gap-6 bg-transparent">
            <div className="space-y-2">
              {currentUser ? (
                <Input {...register("userId")} className="hidden" />
              ) : (
                <>
                  <div className="space-y-2">
                    <FormField
                      name="name"
                      control={control}
                      render={({ field }) => (
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
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="space-y-2 w-full">
                      <FormField
                        name="email"
                        control={control}
                        render={({ field }) => (
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
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2 w-full">
                      <FormField
                        name="phoneNo"
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <Label
                              htmlFor="phoneNo"
                              className="text-neutral-500 font-medium"
                            >
                              Phone Number
                            </Label>
                            <FormControl>
                              <PhoneInput
                                inputClass="!w-full"
                                onChange={(value) =>
                                  handlePhoneNumber(value, field.onChange)
                                }
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <FormField
                name="subject"
                control={control}
                render={({ field }) => (
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
                        {...field}
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
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="message"
                      className="text-neutral-500 font-medium"
                    >
                      Message
                    </Label>
                    <FormControl>
                      <Textarea
                        id="message"
                        placeholder="Enter message here"
                        className="h-60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button size="lg" className="mt-10 bg-golden" disabled={isPending}>
            Submit Ticket
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateSupportForm;
