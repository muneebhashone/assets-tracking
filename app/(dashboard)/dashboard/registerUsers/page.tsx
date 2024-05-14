import { getRegisteredUsers } from "@/actions/usersActions";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/requestedUser-tables/columns";
import { EmployeeTable } from "@/components/tables/requestedUser-tables/requestedUser";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { IUser } from "@/types";

const breadcrumbItems = [{ title: "Employee", link: "/dashboard/employee" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  // const offset = (page - 1) * pageLimit;

  const response = await getRegisteredUsers({
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
            title={`Registered Users (${resData?.totalUsers})`}
            description="Manage registered users  "
          />
        </div>
        <Separator />

        <EmployeeTable
          // searchKey=""
          pageNo={page}
          columns={columns}
          totalUsers={resData?.totalUsers}
          data={resData?.users as IUser[]}
          pageCount={resData.totalPages}
        />
      </div>
    </>
  );
}
