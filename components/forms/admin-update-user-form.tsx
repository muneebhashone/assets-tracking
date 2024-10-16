"use client";
import { Switch } from "@/components/ui/switch";
import { useAdminUpdateUser } from "@/services/admin/user.mutations";
import { useGetCompanies } from "@/services/companies.queries";
import {
  permissionEnums,
  rolesEnums,
  RoleType,
  statusEnums,
} from "@/types/user.types";
import {
  EligibleRolesForCreation,
  PermissionsForDisplay,
  UserRole,
} from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

import { User } from "@/types/services/auth.types";
import { handlePhoneNumber, sanitizeObject } from "@/utils/common.utils";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
import { useGetUsers } from "@/services/user.queries";
const companyIdRequired: RoleType[] = [
  "WHITE_LABEL_ADMIN",
  "WHITE_LABEL_SUB_ADMIN",
  "CLIENT_SUPER_USER",
];
const clientIdRequired: RoleType[] = ["CLIENT_USER"];

const adminUserUpdateFormSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })

      .email("Email must be valid")
      .optional(),
    name: z.string({ required_error: "Name is required" }).min(1).optional(),
    phoneNo: z
      .string()
      .refine(
        (value) => validator.isMobilePhone(value, "any", { strictMode: true }),
        "Phone no. must be valid",
      )
      .optional(),
    role: z
      .enum(rolesEnums, { required_error: "Role must be defined" })
      .optional(),
    permissions: z
      .enum(permissionEnums, { required_error: "Permissions must be defined" })
      .array()
      .min(1)
      .optional(),
    isActive: z.boolean().optional(),
    status: z
      .enum(statusEnums, { required_error: "Status must be defined" })
      .optional(),
    credits: z.union([
      z
        .string()
        .min(1)
        .refine((value) => validator.isNumeric(value))
        .transform(Number),
      z.number(),
    ]),

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

type AdminUserUpdateFormSchemaType = z.infer<typeof adminUserUpdateFormSchema>;

interface AdminUpdateUserFormProps {
  setModalState: Dispatch<SetStateAction<boolean>>;
  modalState: boolean;
  userData: User;
}

const AdminUpdateUserForm = ({
  modalState,
  setModalState,
  userData,
}: AdminUpdateUserFormProps) => {
  const initialData: AdminUserUpdateFormSchemaType = {
    clientId:
      userData.role === "CLIENT_USER" ? String(userData.clientId) : undefined,

    credits: userData.credits,
    companyId: userData.companyId ? String(userData.companyId) : undefined,
    email: userData.email ? userData.email : undefined,
    isActive: userData.isActive ? userData.isActive : undefined,

    name: userData.name ? userData.name : undefined,
    permissions: userData.permissions ? userData.permissions : undefined,
    phoneNo: userData.phoneNo ? userData.phoneNo : undefined,
    role: userData.role ? userData.role : undefined,
    status: userData.status ? userData.status : undefined,
  };
  const form = useForm<AdminUserUpdateFormSchemaType>({
    values: initialData,
    resolver: zodResolver(adminUserUpdateFormSchema),
  });

  const { control, handleSubmit, reset, watch } = form;

  const { mutate, isPending } = useAdminUpdateUser({
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

  const adminUpdateFormHandler = (data: AdminUserUpdateFormSchemaType) => {
    // eslint-disable-next-line
    const { email, ...sanitizedPayload } = sanitizeObject(data);
    mutate({ id: String(userData.id), ...sanitizedPayload });
  };

  const { data: companies } = useGetCompanies({
    pageParam: 1,
    limitParam: 999,
  });

  const { data: clients } = useGetUsers({
    filterByRole: "CLIENT_SUPER_USER",
    filterByActive: "true",
    filterByStatus: ["APPROVED"],
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
                        <Input
                          placeholder="Enter your name..."
                          disabled={true}
                          {...field}
                        />
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
                        <PhoneInput
                          value={field.value}
                          inputClass="!w-full"
                          onChange={(value) =>
                            handlePhoneNumber(value, field.onChange)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {clientIdRequired.includes(watch("role") as RoleType) && (
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
                              {clients?.results?.map((client, index) => {
                                return (
                                  <SelectItem
                                    value={String(client.id)}
                                    key={index}
                                  >
                                    {client.name}
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

              {companyIdRequired.includes(watch("role") as RoleType) && (
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
                              {companies?.results?.map((company, index) => {
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
                        Is Active
                      </Label>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          className="data-[state=checked]:bg-green-500"
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
                            {EligibleRolesForCreation?.["SUPER_ADMIN"]?.map(
                              (role, index) => {
                                return (
                                  <SelectItem value={String(role)} key={index}>
                                    {UserRole?.[role]}
                                  </SelectItem>
                                );
                              },
                            )}
                            <SelectItem value={String("WHITE_LABEL_ADMIN")}>
                              White Label Admin
                            </SelectItem>
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
                          <SelectTrigger id="status" className="capitalize">
                            <SelectValue placeholder="Select the Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusEnums?.map((status, index) => {
                              return (
                                <SelectItem
                                  value={status}
                                  key={index}
                                  className="capitalize"
                                >
                                  {status?.toLowerCase()}
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
                          className="bg-green-600 text-xs text-white px-2 py-1 m-0.5 "
                          check={false}
                          options={permissionEnums?.map((permission) => {
                            return {
                              label: PermissionsForDisplay[permission],
                              value: permission,
                            };
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
              Save
            </Button>
          </form>
        </Form>
      </ModalCustom>
    </>
  );
};

export default AdminUpdateUserForm;
