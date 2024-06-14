"use client";

import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/requested-user-table/columns";
import { RequestedUserTable } from "@/components/tables/requested-user-table/requested-user";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { paginatedMockUser } from "@/mockData/user.mockData";
import { User, useCurrentUser } from "@/services/auth.mutations";
import { useGetUsers } from "@/services/user.queries";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const breadcrumbItems = [
  { title: "Users", link: "/dashboard/requested-users" },
];

export default function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const search = String(searchParams.get("search")) || "";
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { data: currentUser, isLoading: selfLoading } = useCurrentUser();
  const { data: users, isLoading: allUsersLoading } = useGetUsers({
    limitParam: pageLimit,
    pageParam: page,
    searchString: search,
  });

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Requested Users (${paginatedMockUser.results.length})`}
          description="Manage requested users  "
        />
      </div>
      <Separator />
      {allUsersLoading ? (
        <div>Loading ...</div>
      ) : (
        <RequestedUserTable
          columns={columns}
          data={users?.results as User[]}
          pageCount={users?.paginatorInfo.pages || 0}
        />
      )}
    </div>
  );
}