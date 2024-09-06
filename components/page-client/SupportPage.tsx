"use client";

import BreadCrumb from "@/components/breadcrumb";

import SearchBar from "@/components/SearchBar";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  SupportType,
  useGetAllSupportForms,
} from "@/services/admin/support.queries";
import { columns } from "../tables/support-table/columns";
import { SupportTable } from "../tables/support-table/support";
import { Switch } from "../ui/switch";

const breadcrumbItems = [
  { title: "Support Forms", link: "/dashboard/support" },
];

const SupportPage = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const [filterResolved, setFilterResolved] = useState<boolean>(false);

  const { data: support, isLoading: allSupportLoading } = useGetAllSupportForms(
    {
      limitParam: pageLimit,
      pageParam: page,
      searchString: search,
      filterByResolved: filterResolved ? filterResolved : undefined,
    },
  );

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Support Requests (${support?.data?.results?.length || 0})`}
            description="Manage tickets "
          />
        </div>
        <Separator />
        <div className="flex justify-between">
          <SearchBar />
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-neutral-700">
              Filter Resolved
            </p>
            <Switch
              onCheckedChange={() => setFilterResolved((prev) => !prev)}
              className="transition-transform transform hover:scale-105"
            />
          </div>
        </div>
        {allSupportLoading ? (
          <div>Loading ... </div>
        ) : (
          <SupportTable
            columns={columns}
            data={(support?.data?.results || []) as SupportType[]}
            pageCount={support?.data?.paginatorInfo.pages || 0}
          />
        )}
      </div>
    </>
  );
};

export default SupportPage;
