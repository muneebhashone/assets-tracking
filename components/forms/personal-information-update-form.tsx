"use client";

import React from "react";
import { Label } from "../ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCurrentUser } from "@/services/auth.mutations";
import { User } from "@/types/services/auth.types";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button } from "../ui/button";
import { useUpdateProfileData } from "@/services/user.mutations";
import { toast } from "../ui/use-toast";

const profileUpdateFormSchema = z.object({
  name: z.string({
    required_error: "This field is required",
  }),

  phoneNo: z
    .string({ message: "Must be a string value" })

    .nullable(),

  phoneCountryCode: z
    .string()
    .min(2, "Invalid Country Code")
    .regex(/^\+\d+$/, "Not a valid country code")
    .nullable(),
  email: z.string().nullable(),
});

export type ProfileUpdateFormType = z.infer<typeof profileUpdateFormSchema>;

const PerSonalInformationForm = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const { name, phoneNo, phoneCountryCode, email, ...other } =
    user?.user as User;
  const form = useForm<ProfileUpdateFormType>({
    defaultValues: !userLoading
      ? { name, phoneNo, phoneCountryCode, email }
      : {},
  });
  const { control, handleSubmit, register, setValue, formState } = form;

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
    const { email, ...rest } = data;
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
                  <FormLabel className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-xs mb-1">
                    Name
                  </FormLabel>
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
            <Label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-xs mb-1">
              Phone Number
            </Label>

            <PhoneInput
              value={
                form.watch("phoneCountryCode")?.replace("+", "") ||
                "" + form.watch("phoneNo") ||
                ""
              }
              onChange={(number, phoneData: CountryData) => {
                setValue("phoneNo", number.replace(phoneData.dialCode, ""));
                setValue("phoneCountryCode", `+${phoneData.dialCode}`);
              }}
            />
            {formState.errors.phoneNo?.message && (
              <div className="text-[0.8rem] font-medium text-destructive">
                {formState?.errors.phoneNo?.message}
              </div>
            )}
            {formState.errors.phoneCountryCode?.message && (
              <div className="text-[0.8rem] font-medium text-destructive">
                {formState?.errors.phoneNo?.message}
              </div>
            )}
          </div>
        </div>
        <Button size="lg" className="mt-10 bg-golden">
          Save
        </Button>
      </form>
    </Form>
  );
};

export default PerSonalInformationForm;
