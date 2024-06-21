import { ScrollArea } from "@/components/ui/scroll-area";
type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};
const CompanyPage = async (props: Props) => {
  // const page = Number(searchParams.page) || 1;
  // const pageLimit = Number(searchParams.limit) || 10;
  // const search = String(searchParams.search) || "";

  return (
    <ScrollArea className="h-full ">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* <CompanyTable
          columns={columns}
          data={company.data as Company[]}
          pageCount={company.paginatorInfo?.totalRecords || 0}
          searchKey={search}
        /> */}
      </div>
    </ScrollArea>
  );
};

export default CompanyPage;
