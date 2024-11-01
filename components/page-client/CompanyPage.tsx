"use client";
import { useCurrentUser } from "@/services/auth.mutations";
import { Company, useGetCompanies } from "@/services/companies.queries";
import { PermissionsType } from "@/types/user.types";
import { checkPermissions } from "@/utils/user.utils";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import AdminCompanyCreateForm from "../forms/admin-company-form";
import CompanyAuthFormSignUp from "../forms/user-company-form";
import { ModalCustom } from "../ModalComponent";
import SearchBar from "../SearchBar";
import { columns } from "../tables/company-table/columns";
import { CompanyTable } from "../tables/company-table/company-table";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

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
        {currentUser?.user?.role === "SUPER_ADMIN" ? (
          <AdminCompanyCreateForm
            closeModal={() => setModalOpen(false)}
            redirect={false}
          />
        ) : (
          <CompanyAuthFormSignUp
            redirect={false}
            closeModal={() => setModalOpen(false)}
          />
        )}
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
                ["CREATE_COMPANY", "CREATE_USER"],
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
              ) : (
                <CompanyTable
                  columns={columns}
                  data={(company?.results || []) as Company[]}
                  pageCount={company?.paginatorInfo?.pages || 0}
                />
              )}
            </ScrollArea>
          </div>
        </div>
      </ScrollArea>
    </>
  );
};

export default CompanyPage;
