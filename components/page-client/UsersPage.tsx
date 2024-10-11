"use client";

import BreadCrumb from "@/components/breadcrumb";

import Filter, { IRecord, OptionsMapperType } from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
import { columns } from "@/components/tables/users-table/columns";
import { UsersTable } from "@/components/tables/users-table/users";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/services/auth.mutations";
import { useGetUsers } from "@/services/user.queries";
import { User } from "@/types/services/auth.types";
import { PermissionsType, RoleType } from "@/types/user.types";
import { EligibleRolesForFilter } from "@/utils/constants";
import { checkPermissions } from "@/utils/user.utils";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import AdminCreateUserForm from "../forms/admin-create-user-form";
import UserCreateForm from "../forms/user-create-form";

const breadcrumbItems = [{ title: "Users", link: "/dashboard/activeUsers" }];

const UsersPage = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const filterByActive = searchParams.get("filterByActive");
  const filterByRole = searchParams.get("filterByRole");

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [adminModal, setAdminModal] = useState<boolean>(false);

  const { data: currentUser } = useCurrentUser();
  const { data: users, isLoading: allUsersLoading } = useGetUsers({
    limitParam: pageLimit,
    pageParam: page,
    searchString: search,
    filterByActive: filterByActive ? filterByActive : undefined,
    filterByRole: filterByRole ? (filterByRole as RoleType) : undefined,
    filterByStatus: ["APPROVED"],
  });
  const optionsMapper: OptionsMapperType["User"] = {
    filterByActive: [
      { label: "true", value: true },
      { label: "false", value: false },
    ] as IRecord<string, boolean>[],

    filterByRole: EligibleRolesForFilter[
      currentUser?.user.role as RoleType
    ]?.map((role) => {
      return {
        value: role,
        label: role.split("_").join(" ").toLocaleLowerCase(),
      };
    }) as IRecord<string, RoleType>[],
  };

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Users (${users?.results?.length || 0})`}
            description="Manage users "
          />
        </div>
        <Separator />

        {currentUser?.user.role === "SUPER_ADMIN" ? (
          <>
            {" "}
            <Button
              className="border rounded-md px-4 py-2 bg-golden text-white hover:bg-zinc-900"
              onClick={() => setAdminModal((prev) => !prev)}
            >
              Create
            </Button>
          </>
        ) : (
          checkPermissions(currentUser?.user.permissions as PermissionsType[], [
            "CREATE_USER",
          ]) && (
            <Button
              className="border rounded-md px-4 py-2 bg-golden text-white hover:bg-zinc-900"
              onClick={() => setModalOpen((prev) => !prev)}
            >
              Create
            </Button>
          )
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
            data={(users?.results || []) as User[]}
            pageCount={users?.paginatorInfo.pages || 0}
          />
        )}
        <UserCreateForm modalState={modalOpen} setModalState={setModalOpen} />
        <AdminCreateUserForm
          modalState={adminModal}
          setModalState={setAdminModal}
        />
      </div>
    </>
  );
};

export default UsersPage;
