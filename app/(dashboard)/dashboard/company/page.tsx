import { getAllCompany } from "@/actions/companyActions";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { columns } from "@/components/tables/company-table/columns";
import { CompanyTable } from "@/components/tables/company-table/company-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@/lib/auth-options";
import { ROLE } from "@/types";
import { Company } from "@prisma/client";
import { Session } from "next-auth";
type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};
const CompanyPage = async (props: Props) => {
  const { searchParams } = props;

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const search = String(searchParams.search) || "";
  const company = await getAllCompany({
    limitParam: pageLimit,
    pageParam: page,
  });
  // pageNo={page}
  //           columns={columns}
  //           totalUsers={response?.totalUsers}
  //           data={response?.users as IUser[]}
  //           pageCount={response.totalPages}
  return (
    <ScrollArea className="h-full ">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <CompanyTable
          columns={columns}
          data={company.data as Company[]}
          pageCount={company.paginatorInfo?.totalRecords || 0}
          searchKey={search}
        />
      </div>
    </ScrollArea>
  );
};

export default CompanyPage;
