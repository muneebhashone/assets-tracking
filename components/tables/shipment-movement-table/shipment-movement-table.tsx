"use client";
import {
  type ColumnDef,
  type PaginationState,
  type ExpandedState,
  type GroupingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getGroupedRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Movement } from "@/types/services/shipment.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSizeOptions?: number[];
  pageCount: number;
}

export function ShipmentMovementTable({
  columns,
  data,
  pageCount,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTableProps<Movement, any>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams?.get("page") ?? "1");
  const pageAsNumber = Number(page);
  const fallbackPage =
    Number.isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const per_page = searchParams?.get("limit") ?? "10";
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = Number.isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
  const tableData = data;
  const [isLoading, setIsLoading] = React.useState(false);

  // Define grouping state
  const [grouping, setGrouping] = React.useState<GroupingState>([
    "location.name",
  ]);

  // State for expanded rows - initialize as true to expand all groups by default
  const [expanded, setExpanded] = React.useState<ExpandedState>(true);

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(window.location.search);

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [],
  );

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: fallbackPage - 1,
      pageSize: fallbackPerPage,
    });

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        limit: pageSize,
      })}`,
      {
        scroll: false,
      },
    );
  }, [pageIndex, pageSize, router, pathname, createQueryString]);

  // Add loading state when data changes
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const table = useReactTable({
    data: tableData,
    columns: columns,
    pageCount: pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
      expanded,
      grouping,
    },
    onExpandedChange: setExpanded,
    onGroupingChange: setGrouping,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
    enableGrouping: true,
    debugTable: true,
  });

  return (
    <>
      <ScrollArea className="rounded-md border border-slate-200  shadow-sm">
        <Table className="relative">
          <TableHeader className="bg-slate-100/80 ">
            {table.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers?.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-center font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns?.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm text-muted-foreground">
                      Loading data...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table?.getRowModel().rows?.length ? (
              table?.getRowModel().rows?.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`text-center ${
                      row.getIsGrouped()
                        ? "font-bold bg-slate-50/70  hover:bg-slate-100/70 "
                        : ""
                    }`}
                  >
                    {row.getVisibleCells()?.map((cell) => {
                      // Handle grouping cell (location name)
                      if (cell.getIsGrouped()) {
                        return (
                          <TableCell key={cell.id} colSpan={1} className="py-3">
                            <button
                              type="button"
                              onClick={row.getToggleExpandedHandler()}
                              className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                            >
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 ">
                                {row.getIsExpanded() ? (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5" />
                                )}
                              </span>
                              <span className="font-medium">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </span>
                              <span className="ml-1 text-xs font-normal text-muted-foreground">
                                ({row.subRows.length}{" "}
                                {row.subRows.length === 1 ? "item" : "items"})
                              </span>
                            </button>
                          </TableCell>
                        );
                      }

                      // Handle aggregated cells in the grouped row
                      if (cell.getIsAggregated()) {
                        return (
                          <TableCell key={cell.id} className="text-slate-500 ">
                            {flexRender(
                              cell.column.columnDef.aggregatedCell ??
                                cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      }

                      // Handle placeholder cells
                      if (cell.getIsPlaceholder()) {
                        return (
                          <TableCell
                            key={cell.id}
                            className="bg-slate-50/30 "
                          />
                        );
                      }

                      // Regular cell
                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            row.depth > 0 ? "pl-4 transition-colors" : ""
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-1 py-4">
                    <p className="text-lg font-medium text-slate-700 ">
                      No results found
                    </p>
                    <p className="text-sm text-slate-500 ">
                      There are no movements to display
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
