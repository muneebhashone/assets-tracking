"use client";

import { useUpdateCompany } from "@/services/companies.mutations";
import { Company } from "@/services/companies.queries";
import { sanitizeObject } from "@/utils/common.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ModalCustom } from "../ModalComponent";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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

type UpdateCompanyFormSchemaType = z.infer<typeof UpdateCompanyFormSchema>;

const UpdateCompanyFormSchema = z.object({
  name: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  industry: z.string().min(1).optional(),
});

interface CompanyUpdateFormProps {
  companyData: Company;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const CompanyUpdateForm = ({
  modalOpen,
  setModalOpen,
  companyData,
}: CompanyUpdateFormProps) => {
  const initialValues: UpdateCompanyFormSchemaType = {
    address: companyData?.address ? companyData?.address : undefined,
    city: companyData?.city ? companyData?.city : undefined,
    country: companyData?.country ? companyData?.country : undefined,
    industry: companyData?.industry ? companyData?.industry : undefined,
    name: companyData?.name ? companyData?.name : undefined,
  };

  const form = useForm<UpdateCompanyFormSchemaType>({
    resolver: zodResolver(UpdateCompanyFormSchema),
    values: initialValues,
  });
  const { control, handleSubmit, reset } = form;

  const { mutate } = useUpdateCompany({
    onSuccess(data, variables, context) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });
      reset();
      setModalOpen(false);
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

  const onSubmit = (data: UpdateCompanyFormSchemaType) => {
    if (data) {
      const sanitizedResult = sanitizeObject(data);
      mutate({ id: companyData.id, ...sanitizedResult });
    }
  };
  return (
    <>
      <ModalCustom
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-h-[70vh] overflow-auto min-w-[40rem] mild-scrollbar backdrop-opacity-50"
      >
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex  w-full items-center justify-center ">
              <Card className="w-full max-w-xl border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-zinc-700">
                    Update Company Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 ">
                  <div className="space-y-2 w-[100%] contents ">
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2 ">
                    <FormField
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <Label
                            htmlFor="address"
                            className="text-neutral-500 font-medium"
                          >
                            Address
                          </Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Write address here..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <Label
                            htmlFor="city"
                            className="text-neutral-500 font-medium"
                          >
                            City
                          </Label>
                          <FormControl>
                            <Input
                              id="city"
                              placeholder="Enter City..."
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
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <Label
                            htmlFor="country"
                            className="text-neutral-500 font-medium "
                          >
                            Country{" "}
                          </Label>
                          <FormControl>
                            <Input
                              id="country"
                              placeholder="Enter your Country..."
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
                      name="industry"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <Label
                            htmlFor="industry"
                            className="text-neutral-500 font-medium"
                          >
                            Industry
                          </Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your Industry..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="w-full justify-end ">
                  <Button
                    type="submit"
                    className="w-[25%] border-r-4 bg-[#D3991F] hover:bg-[#bf8c1e]"
                  >
                    <span className="mr-2">Update</span>
                    <PlusCircledIcon />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </ModalCustom>
    </>
  );
};

export default CompanyUpdateForm;
