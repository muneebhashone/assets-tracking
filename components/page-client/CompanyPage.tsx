"use client";
import { Company, useGetCompanies } from "@/services/companies.queries";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { columns } from "../tables/company-table/columns";
import { CompanyTable } from "../tables/company-table/company-table";
import SearchBar from "../SearchBar";
import { Button } from "../ui/button";
import CompanyAuthFormSignUp from "../forms/user-company-form";
import { ModalCustom } from "../ModalComponent";
import { checkPermissions } from "@/utils/user.utils";
import { useCurrentUser } from "@/services/auth.mutations";
import { PermissionsType } from "@/types/user.types";

const CompanyPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const { data: currentUser } = useCurrentUser();

  const { data: company, isLoading } = useGetCompanies({
    limitParam: pageLimit,
    pageParam: page,
    searchString: search,
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  return (
    <>
      <ModalCustom
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className=" overflow-auto min-w-[40rem]  backdrop-opacity-50"
      >
        <CompanyAuthFormSignUp
          redirect={false}
          closeModal={() => setModalOpen(false)}
        />
      </ModalCustom>
      <ScrollArea className="h-full ">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight">
              List of Companies
            </h1>
            <div className="  flex justify-between mb-2">
              <p className="text-sm tracking-tight">
                You can create, view and edit all companies from the table
                below.
              </p>
              <SearchBar />
            </div>
            {(currentUser?.user.role === "SUPER_ADMIN" ||
              checkPermissions(
                currentUser?.user.permissions as PermissionsType[],
                ["CREATE_USER"],
              )) && (
              <div className="flex mb-4">
                <Button
                  className="bg-golden"
                  onClick={() => setModalOpen(true)}
                >
                  Create
                </Button>
              </div>
            )}
            <ScrollArea className="h-full ">
              {isLoading ? (
                <div>Loading...</div>
              ) : Array.isArray(company?.results) ? (
                <CompanyTable
                  columns={columns}
                  data={company?.results as Company[]}
                  pageCount={company?.paginatorInfo?.pages || 0}
                  searchKey={search}
                />
              ) : (
                "No Record Found"
              )}
            </ScrollArea>
          </div>
        </div>
      </ScrollArea>
    </>
  );
};

export default CompanyPage;
