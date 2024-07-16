"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CardViewPagination({
  paginator,
}: {
  paginator: {
    skip: number;
    limit: number;
    currentPage: number;
    pages: number;
    hasNextPage: boolean;
    totalRecords: number;
    pageSize: number;
  };
}) {
  const { pages } = paginator;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState<number | undefined>(1);
  const searchValue = searchParams.get("search") || "";
  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );
  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: page || 1,
      })}`,
      { scroll: false },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (searchValue?.length > 0) {
      router.push(
        `${pathname}?${createQueryString({
          page: null,
          limit: null,
          search: searchValue,
        })}`,
        {
          scroll: false,
        },
      );
    }
    if (searchValue?.length === 0 || searchValue === undefined) {
      router.push(
        `${pathname}?${createQueryString({
          page: null,
          limit: null,
          search: null,
        })}`,
        {
          scroll: false,
        },
      );
    }

    setPage(1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);
  const paginationPageArray = Array<number>(pages).fill(0);
  return (
    <div className="flex justify-center items-center gap-4 py-8">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                page !== 1 && setPage((prev) => (prev as number) - 1)
              }
            />
          </PaginationItem>
          {paginationPageArray?.map((_, index) => {
            return (
              <PaginationItem key={index}>
                <PaginationLink onClick={() => setPage(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                page !== pages && setPage((next) => (next as number) + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
