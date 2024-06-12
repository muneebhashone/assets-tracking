import BreadCrumb from "@/components/breadcrumb";
import { ActiveUserTable } from "@/components/tables/active-user-table/active-user";

import { columns } from "@/components/tables/active-user-table/columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { paginatedMockUser } from "@/mockData/user.mockData";
import { IUser } from "@/types/user.types";

const breadcrumbItems = [{ title: "Users", link: "/dashboard/activeUsers" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  // const offset = (page - 1) * pageLimit;

  // const response = await getActiveUser({
  //   pageParam: page,
  //   pageSizeParam: pageLimit,
  // });

  // const resData = response;

  return (
    <>
      {/* {response === "unauthorized" ? (
        <h1>you dont have access to this route</h1>
      ) : ( */}
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Active Users (10)`}
            description="Manage active users "
          />
        </div>
        <Separator />
        <ActiveUserTable
          columns={columns}
          data={paginatedMockUser.results as IUser[]}
          pageCount={paginatedMockUser.paginatorInfo.pages}
        />

       
      </div>
     
    </>
  );
}
