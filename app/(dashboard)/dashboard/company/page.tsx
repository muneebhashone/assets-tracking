import CompanyPage from "@/components/CompanyPage";
import { columns } from "@/components/tables/company-table/columns";
import { CompanyTable } from "@/components/tables/company-table/company-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Company, useGetCompanies } from "@/services/companies.queries";

const Page = async () => {
return <CompanyPage/>

};

export default Page;
