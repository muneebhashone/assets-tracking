"use client";
import { Switch } from "@/components/ui/switch";
import { useAdminCreateUser } from "@/services/admin/user.mutations";
import { useGetCompanies } from "@/services/companies.queries";
import {
  permissionEnums,
  rolesEnums,
  RoleType,
  statusEnums,
} from "@/types/user.types";
import { EligibleRolesForCreation, UserRole } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";
import { z } from "zod";
import { ModalCustom } from "../ModalComponent";
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
import { MultiSelect } from "../ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";
import { passwordValidation } from "@/utils/auth.utils";
import { useGetUsers } from "@/services/user.queries";

const adminCreateUserFormSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .min(1)
      .email("Email must be valid"),
    name: z.string({ required_error: "Name is required" }).min(1),
    phoneNo: z
      .string()
      .min(1)
      .refine(
        (value) => validator.isMobilePhone(value, "any", { strictMode: true }),
        "Phone no. must be valid",
      )
      .optional(),
    role: z.enum(rolesEnums, { required_error: "Role must be defined" }),
    password: passwordValidation("password").optional(),
    permissions: z
      .enum(permissionEnums, { required_error: "Permissions must be defined" })
      .array()
      .min(1),
    isActive: z.boolean().default(false),
    status: z.enum(statusEnums, { required_error: "Status must be defined" }),
    credits: z
      .string()
      .min(1)
      .refine((value) => validator.isNumeric(value))
      .transform(Number),
    companyId: z
      .string()
      .min(1)
      .refine((value) => validator.isNumeric(value))
      .optional(),
    clientId: z
      .string()
      .min(1)
      .refine((value) => validator.isNumeric(value))
      .optional(),
  })
  .superRefine((values, ctx) => {
    const companyIdRequired: RoleType[] = [
      "WHITE_LABEL_ADMIN",
      "WHITE_LABEL_SUB_ADMIN",
      "CLIENT_SUPER_USER",
    ];
    const clientIdRequired: RoleType[] = ["CLIENT_USER"];

    if (values?.role) {
      if (companyIdRequired.includes(values.role) && !values.companyId) {
        ctx.addIssue({
          message: "companyId field is required",
          code: "custom",
        });
      }

      if (clientIdRequired.includes(values.role) && !values.clientId) {
        ctx.addIssue({
          message: "clientId field is required",
          code: "custom",
        });
      }
    }
  });

type AdminCreateUserFormSchemaType = z.infer<typeof adminCreateUserFormSchema>;

interface AdminCreateUserFormProps {
  setModalState: Dispatch<SetStateAction<boolean>>;
  modalState: boolean;
}

const AdminCreateUserForm = ({
  modalState,
  setModalState,
}: AdminCreateUserFormProps) => {
  const form = useForm<AdminCreateUserFormSchemaType>({
    resolver: zodResolver(adminCreateUserFormSchema),
  });
  const { control, handleSubmit, reset, watch } = form;
  const { data: clientSuperUsers } = useGetUsers({
    filterByRole: "CLIENT_SUPER_USER",
    filterByStatus: ["APPROVED"],
    filterByActive: true,
  });

  const { mutate, isPending } = useAdminCreateUser({
    onSuccess(data) {
      toast({
        variant: "default",
        description: data.message,
        title: "Success",
      });
      reset();
      setModalState(false);
    },
    onError(error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message,
        title: "Error",
      });
    },
  });

  const adminUpdateFormHandler = (data: AdminCreateUserFormSchemaType) => {
    mutate(data);
  };

  const { data: companies } = useGetCompanies({
    pageParam: 1,
    limitParam: 999,
  });

  return (
    <>
      <ModalCustom isOpen={modalState} onClose={() => setModalState(false)}>
        <Form {...form}>
          <form onSubmit={handleSubmit(adminUpdateFormHandler)}>
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-xs mb-1">
                        Email
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
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-xs mb-1">
                        Password
                      </Label>
                      <FormControl>
                        <Input placeholder="Enter Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {watch("role") === "CLIENT_USER" && (
                <div>
                  <FormField
                    name="clientId"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="clientId"
                          className="font-medium text-xs"
                        >
                          Client
                        </Label>
                        <FormControl>
                          <Select
                            onValueChange={field?.onChange}
                            value={String(field?.value)}
                            defaultValue={field.value}
                          >
                            <SelectTrigger id="clientId">
                              <SelectValue placeholder="Clients" />
                            </SelectTrigger>
                            <SelectContent>
                              {clientSuperUsers?.results.map(
                                (clientSuperUser, index) => {
                                  return (
                                    <SelectItem
                                      value={String(clientSuperUser.id)}
                                      key={index}
                                    >
                                      {clientSuperUser.name}
                                    </SelectItem>
                                  );
                                },
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {(watch("role") === "CLIENT_SUPER_USER" ||
                watch("role") === "WHITE_LABEL_ADMIN" ||
                watch("role") === "WHITE_LABEL_SUB_ADMIN") && (
                <div>
                  <FormField
                    name="companyId"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="companyId"
                          className="font-medium text-xs"
                        >
                          Company
                        </Label>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={String(field.value)}
                            defaultValue={field.value}
                            // disabled={isPending || isFetching}
                          >
                            <SelectTrigger id="companyId">
                              <SelectValue placeholder="Select a Company" />
                            </SelectTrigger>
                            <SelectContent>
                              {companies?.results.map((company, index) => {
                                return (
                                  <SelectItem
                                    value={String(company.id)}
                                    key={index}
                                  >
                                    {company.name}
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
              )}

              <div>
                <FormField
                  control={control}
                  name="credits"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-xs mb-1">
                        credits
                      </Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-xs mb-1">
                        isActive
                      </Label>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="role" className="font-medium text-xs">
                        Role
                      </Label>
                      <FormControl>
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select the Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {EligibleRolesForCreation["SUPER_ADMIN"]?.map(
                              (role, index) => {
                                return (
                                  <SelectItem value={String(role)} key={index}>
                                    {UserRole[role]}
                                  </SelectItem>
                                );
                              },
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="status" className="font-medium text-xs">
                        Status
                      </Label>
                      <FormControl>
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select the Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusEnums.map((status, index) => {
                              return (
                                <SelectItem
                                  value={status}
                                  className="capitalize"
                                  key={index}
                                >
                                  {status}
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
              <div>
                <FormField
                  control={control}
                  name="permissions"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-xs mb-1">
                        Permissions
                      </Label>
                      <FormControl>
                        <MultiSelect
                          defaultValue={field.value as string[]}
                          onValueChange={field.onChange}
                          className="bg-green-600 text-xs text-white px-2 py-1 m-0.5"
                          check={false}
                          options={permissionEnums.map((permission) => {
                            return { label: permission, value: permission };
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button size="lg" className="mt-10 bg-golden" disabled={isPending}>
              Create
            </Button>
          </form>
        </Form>
      </ModalCustom>
    </>
  );
};

export default AdminCreateUserForm;
