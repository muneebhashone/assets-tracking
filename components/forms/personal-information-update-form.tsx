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
import validator from "validator";

const profileUpdateFormSchema = z.object({
  name: z.string().min(1),
  phoneNo: z
    .string()
    .min(1)
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
  const form = useForm<ProfileUpdateFormType>({
    defaultValues: !userLoading
      ? { name, phoneNo: phoneNo?.replace("+", ""), email }
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
                      onChange={(number) => {
                        field.onChange("+" + number);
                      }}
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
