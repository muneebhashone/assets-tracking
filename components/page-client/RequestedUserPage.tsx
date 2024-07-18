"use client";

import SearchBar from "@/components/SearchBar";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/requested-user-table/columns";
import { RequestedUserTable } from "@/components/tables/requested-user-table/requested-user";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useGetUsers } from "@/services/user.queries";
import { User } from "@/types/services/auth.types";
import { useSearchParams } from "next/navigation";

const breadcrumbItems = [
  { title: "Users", link: "/dashboard/requested-users" },
];

export default function RequestedUserPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const { data: users, isLoading: allUsersLoading } = useGetUsers({
    limitParam: pageLimit,
    pageParam: page,
    searchString: search,
    filterByStatus: ["REQUESTED", "REJECTED"],
  });

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Requested Users (${users?.results?.length || 0})`}
          description="Manage requested users  "
        />
      </div>
      <Separator />
      <SearchBar />
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
