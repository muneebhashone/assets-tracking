"use client";

import { useCurrentUser } from "@/services/auth.mutations";
import { useUpdateProfileData } from "@/services/user.mutations";
import { User } from "@/types/services/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
import { toast } from "../ui/use-toast";
import { handlePhoneNumber, sanitizeObject } from "@/utils/common.utils";

const profileUpdateFormSchema = z.object({
  name: z.string().optional(),
  phoneNo: z
    .string()

    .refine(
      (value) => validator.isMobilePhone(value, "any", { strictMode: true }),
      "Phone no. must be valid",
    )
    .optional(),
  email: z.string().nullable(),
});

export type ProfileUpdateFormType = z.infer<typeof profileUpdateFormSchema>;

const PersonalInformationForm = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const { name, phoneNo, email } = (user?.user as User) ?? {};
  const initialValues = {
    name: name ? name : undefined,
    phoneNo: phoneNo ? phoneNo : undefined,
    email: email,
  };
  const form = useForm<ProfileUpdateFormType>({
    values: initialValues,
    resolver: zodResolver(profileUpdateFormSchema),
  });
  const { control, handleSubmit, register } = form;

  const { mutate: updateProfile } = useUpdateProfileData({
    onSuccess(data) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });
    },
    onError(error) {
      toast({
        title: error.response?.data.message,
        duration: 3000,
        variant: "destructive",
      });
    },
  });
  const handleUpdateProfile = (data: ProfileUpdateFormType) => {
    /* eslint-disable */
    const { email, ...rest } = sanitizeObject(data);

    updateProfile(rest);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-xs mb-1">
                    Name
                  </Label>
                  <FormControl>
                    <Input placeholder="Enter your name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Label
              htmlFor="name"
              className="disabled font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-xs mb-1"
            >
              Email
            </Label>

            <Input type="email" disabled {...register("email")} />
          </div>
          <div>
            <FormField
              control={control}
              name="phoneNo"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-xs mb-1">
                    Phone Number
                  </Label>
                  <FormControl>
                    <PhoneInput
                      value={field.value}
                      onChange={(value) => {
                        handlePhoneNumber(value, field.onChange);
                      }}
                      inputClass="!w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button size="lg" className="mt-10 bg-golden">
          Save
        </Button>
      </form>
    </Form>
  );
};

export default PersonalInformationForm;
