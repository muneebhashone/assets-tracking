import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/requested-user-table/columns";
import { RequestedUserTable } from "@/components/tables/requested-user-table/requested-user";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { paginatedMockUser } from "@/mockData/user.mockData";
import { IUser } from "@/types/user.types";

const breadcrumbItems = [
  { title: "Users", link: "/dashboard/requested-users" },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  // const offset = (page - 1) * pageLimit;

  // const response = await getRegisteredUsers({
  //   pageParam: page,
  //   pageSizeParam: pageLimit,
  // });

  // const resData = response;

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
      <RequestedUserTable
        columns={columns}
        data={paginatedMockUser.results as IUser[]}
        pageCount={paginatedMockUser.paginatorInfo.pages}
      />
    </div>
  );
}
