"use client";

import { ModalCustom } from "@/components/ModalComponent";
import BreadCrumb from "@/components/breadcrumb";

import Filter, { OptionsMapperType } from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
import { columns } from "@/components/tables/users-table/columns";
import { UsersTable } from "@/components/tables/users-table/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/services/auth.mutations";
import { useCreateUser } from "@/services/user.mutations";
import { useGetUsers } from "@/services/user.queries";
import { User } from "@/types/services/auth.types";
import { PermissionsType, RoleType } from "@/types/user.types";
import { EligibleRolesForCreation, UserRole } from "@/utils/constants";
import { checkPermissions } from "@/utils/user.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type CreateUserFormSchemaType = z.infer<typeof createUserSchema>;

const breadcrumbItems = [{ title: "Users", link: "/dashboard/activeUsers" }];

const createUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required field" })
    .email({ message: "Is not a valid email" }),
  name: z.string({ required_error: "Name field is required" }),
  role: z.string({
    required_error: "Please Select the role you want to create",
  }),
});
const UsersPage = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const filterByActive = searchParams.get("filterByActive") || "";
  const filterByRole = searchParams.get("filterByRole") || "";

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { mutate, isPending } = useCreateUser({
    onSuccess(data) {
      toast({
        title: data.message,
        duration: 3000,
        variant: "default",
      });
      setModalOpen(false);
      form.reset();
    },
    onError(error) {
      toast({
        title: error.response?.data.message,
        duration: 3000,
        variant: "default",
      });
    },
  });

  const form = useForm<CreateUserFormSchemaType>({
    resolver: zodResolver(createUserSchema),
  });
  const { control, handleSubmit } = form;

  const onSubmit = (data: CreateUserFormSchemaType) => {
    mutate(data);
  };

  const { data: currentUser, isLoading: selfLoading } = useCurrentUser();
  const { data: users, isLoading: allUsersLoading } = useGetUsers({
    limitParam: pageLimit,
    pageParam: page,
    searchString: search,
    filterByActive: Boolean(filterByActive),
    filterByRole: filterByRole ? (filterByRole as RoleType) : undefined,
    filterByStatus: ["APPROVED"],
  });
  const optionsMapper: OptionsMapperType["User"] = {
    filterByActive: [true, false],
    filterByRole: EligibleRolesForCreation[currentUser?.user.role as RoleType],
    // filterByStatus: ["REQUESTED", "APPROVED", "REJECTED"],
  };

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Users (${users?.results.length || 0})`}
            description="Manage users "
          />
        </div>
        <Separator />

        {checkPermissions(currentUser?.user.permissions as PermissionsType[], [
          "CREATE_USER",
        ]) && (
          <Button
            className="border rounded-md px-4 py-2 bg-golden text-white hover:bg-zinc-900"
            onClick={() => setModalOpen((prev) => !prev)}
          >
            Create
          </Button>
        )}

        <Separator />
        <div className="flex justify-between">
          <SearchBar />
          <Filter
            optionsMapper={optionsMapper}
            type="User"
            defaultValue={"filterByRole"}
          />
        </div>
        {allUsersLoading ? (
          <div>Loading ... </div>
        ) : (
          <UsersTable
            columns={columns}
            data={users?.results as User[]}
            pageCount={users?.paginatorInfo.pages || 0}
          />
        )}
        <ModalCustom
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          className=" overflow-auto min-w-[40rem]  backdrop-opacity-50"
        >
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex  w-full items-center justify-center ">
                <Card className="w-full max-w-xl border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className=" font-semibold text-xl text-zinc-700">
                      Create User
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 ">
                    <div className="space-y-2">
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
                                type="email"
                                placeholder="Enter email here"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                type="name"
                                placeholder="Enter name here"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2 w-[100%]">
                      <FormField
                        name="role"
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <Label
                              htmlFor="role"
                              className="text-neutral-500 font-medium"
                            >
                              Role
                            </Label>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                // disabled={isPending || isFetching}
                                {...field}
                              >
                                <SelectTrigger id="role">
                                  <SelectValue placeholder="Select a Role from the list" />
                                </SelectTrigger>
                                <SelectContent className="overflow-y-auto max-h-[10rem]">
                                  {EligibleRolesForCreation[
                                    currentUser?.user
                                      .role as keyof typeof EligibleRolesForCreation
                                  ].map((role, index) => {
                                    return (
                                      <SelectItem
                                        value={role}
                                        key={index}
                                        disabled={selfLoading}
                                      >
                                        {
                                          UserRole[
                                            role as keyof typeof UserRole
                                          ]
                                        }
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
                  </CardContent>
                  <CardFooter className="w-full justify-end ">
                    <Button
                      type="submit"
                      className="w-[25%] border-r-4 bg-golden"
                      disabled={isPending}
                    >
                      <span className="mr-2">Create</span>
                      <PlusCircledIcon />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </form>
          </Form>
        </ModalCustom>
      </div>
    </>
  );
};

export default UsersPage;
