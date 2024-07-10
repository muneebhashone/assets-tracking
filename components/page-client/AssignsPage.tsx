"use client";

import BreadCrumb from "@/components/breadcrumb";

import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AssignsType, useGetAssigns } from "@/services/admin/assigns.queries";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CreateAssignForm from "../forms/create-assign-form";
import { AssignsTable } from "../tables/assings-table/assigns";
import { columns } from "../tables/assings-table/columns";

const breadcrumbItems = [{ title: "Assigns", link: "/dashboard/assigns" }];

const AssignsPage = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const [assignOpen, setAssignOpen] = useState<boolean>(false);

  const { data: assigns, isLoading: allAssignsLoading } = useGetAssigns({
    limitParam: pageLimit,
    pageParam: page,
    searchString: search,
    // childId:,
    // parentId:,
  });

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Assigns (${assigns?.data?.results.length || 0})`}
            description="Manage assigns "
          />
        </div>
        <Separator />{" "}
        <Button
          className="border rounded-md px-4 py-2 bg-golden text-white hover:bg-zinc-900"
          onClick={() => setAssignOpen((prev) => !prev)}
        >
          Create
        </Button>
        <Separator />
        <div className="flex justify-between">
          <SearchBar />
          {/* <Filter
            optionsMapper={optionsMapper}
            type="User"
            defaultValue={"filterByRole"}
          /> */}
        </div>
        {allAssignsLoading ? (
          <div>Loading ... </div>
        ) : (
          <AssignsTable
            columns={columns}
            data={assigns?.data.results as AssignsType[]}
            pageCount={assigns?.data?.paginatorInfo.pages || 0}
          />
        )}
        <CreateAssignForm
          setModalState={setAssignOpen}
          modalState={assignOpen}
        />
      </div>
    </>
  );
};

export default AssignsPage;
