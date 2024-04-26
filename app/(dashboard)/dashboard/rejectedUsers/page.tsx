import { getRegisteredUsers, getRejectedUsers } from "@/actions/usersActions";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/rejectedUserTable/columns";
import { RejectedTable } from "@/components/tables/rejectedUserTable/rejectedUser";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { IUser } from "@/types";

const breadcrumbItems = [{ title: "Employee", link: "/dashboard/rejectedUsers" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  // const offset = (page - 1) * pageLimit;

  const response = await getRejectedUsers({
    pageParam: page,
    pageSizeParam: pageLimit,
  });

  const resData = response;

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Rejected Users (${resData?.totalUsers})`}
            description="Manage rejected users"
          />
        </div>
        <Separator />

        <RejectedTable
          searchKey="country"
          pageNo={page}
          columns={columns}
          totalUsers={resData?.totalUsers}
          data={resData?.users as IUser[]}
          pageCount={resData.totalUsers}
        />
      </div>
    </>
  );
}
