import { getActiveUser } from "@/actions/usersActions";
import BreadCrumb from "@/components/breadcrumb";
import { EmployeeTable } from "@/components/tables/requestedUser-tables/requestedUser";
import { columns } from "@/components/tables/user-tables/columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { IUser } from "@/types";

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

  const response = await getActiveUser({
    pageParam: page,
    pageSizeParam: pageLimit,
  });

  // const resData = response;

  return (
    <>
      {response === "unauthorized" ? (
        <h1>you dont have access to this route</h1>
      ) : (
        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
          <BreadCrumb items={breadcrumbItems} />

          <div className="flex items-start justify-between">
            <Heading
              title={`Active Users (${response?.totalUsers})`}
              description="Manage active users "
            />
          </div>
          <Separator />

          <EmployeeTable
            // searchKey="country"
            pageNo={page}
            columns={columns}
            totalUsers={response?.totalUsers}
            data={response?.users as IUser[]}
            pageCount={response.totalPages}
          />
        </div>
      )}
    </>
  );
}
