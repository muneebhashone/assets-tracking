"use client";

import { useCurrentUser } from "@/services/auth.mutations";
import { useUpdateProfileData } from "@/services/user.mutations";
import { User } from "@/types/services/auth.types";
import { useForm } from "react-hook-form";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
import { zodResolver } from "@hookform/resolvers/zod";

const profileUpdateFormSchema = z
  .object({
    name: z.string().min(1),
    phoneNo: z
      .string({ message: "Please write Phone number" })
      .min(1)
      .optional(),
    phoneCountryCode: z
      .string({ message: "Please write Phone number" })
      .min(1)
      .optional(),
    email: z.string().nullable(),
  })
  .refine((args) => {
    if (args.phoneNo && !args.phoneCountryCode) {
      return false;
    }

    if (args.phoneCountryCode && !args.phoneNo) {
      return false;
    }

    return true;
  }, "phoneNo and phoneCountryCode must be provided together");
export type ProfileUpdateFormType = z.infer<typeof profileUpdateFormSchema>;

const PersonalInformationForm = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const { name, phoneNo, phoneCountryCode, email } = (user?.user as User) ?? {};
  const form = useForm<ProfileUpdateFormType>({
    defaultValues: !userLoading
      ? { name, phoneNo, phoneCountryCode, email }
      : {},
    resolver: zodResolver(profileUpdateFormSchema),
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
    /* eslint-disable */
    const { email, ...rest } = data;
    console.log(rest);
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
            <Label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-xs mb-1">
              Phone Number
            </Label>

            <PhoneInput
              value={
                String(form.watch("phoneCountryCode")?.replace("+", "")) +
                String(form.watch("phoneNo"))
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

export default PersonalInformationForm;
