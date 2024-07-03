"use client";

import { useCurrentUser } from "@/services/auth.mutations";
import { useProfileUpload } from "@/services/upload.mutations";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ModalCustom } from "../ModalComponent";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { toast } from "../ui/use-toast";
type UploadProfileImageFormType = z.infer<typeof UploadProfileImageFormSchema>;

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const UploadProfileImageFormSchema = z.object({
  avatar: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
});
const UploadProfileForm = ({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean;
  setModalOpen: (state: boolean) => void;
}) => {
  const { data: user } = useCurrentUser();

  const form = useForm<UploadProfileImageFormType>();
  const { register } = form;
  const { mutate: profileUpload, isPending } = useProfileUpload({
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
  const onProfileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size / 1024 / 1024 > 10) {
        alert("Should be less than 10mb");
        return;
      }

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        alert("Type not supported");
        return;
      }
      const formData = new FormData();
      formData.append("avatar", file as Blob);
      profileUpload(formData);
    } else {
      return;
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef) {
      if (!isPending) {
        inputRef?.current?.click();
      }
    }
  };
  return (
    <ModalCustom
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      className="border-r-[20%] bg-slate-200"
    >
      <div className="container">
        <h1 className="text-2xl font-semibold">Profile picture</h1>
        <p className="text-slate-500 mb-4">
          A picture helps people to recognise you and lets you know when you’re
          signed in to your account
        </p>
        <div className="flex justify-center flex-col items-center ">
          <Avatar className="w-[300px] h-[300px] mb-4 cursor-pointer">
            <AvatarImage
              src={user?.user.avatar ?? user?.user.name[0]}
              onClick={handleClick}
            />
            <AvatarFallback>{user?.user.name[0]}</AvatarFallback>
          </Avatar>
          <Form {...form}>
            <form className="space-y-2 w-full">
              <div className="flex justify-center flex-col items-center cursor-pointer">
                <Button
                  className="bg-golden"
                  type="button"
                  onClick={handleClick}
                  disabled={isPending}
                >
                  Upload Profile
                </Button>
                <input
                  type="file"
                  {...register("avatar")}
                  ref={inputRef}
                  className="hidden"
                  onChange={onProfileUpload}
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </ModalCustom>
  );
};

export default UploadProfileForm;
