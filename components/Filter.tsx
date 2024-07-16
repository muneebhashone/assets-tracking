"use client";

import useQueryUpdater from "@/hooks/useQueryUpdater";
import { TrackWithType } from "@/services/shipment.queries";
import { RoleType } from "@/types/user.types";
import {
  FilterIcon,
  PlusCircle,
  RefreshCw,
  SearchIcon,
  XCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { TagsInput } from "react-tag-input-component";
import { ModalCustom } from "./ModalComponent";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";

export type IRecord<TLabel, TValue> = {
  label: TLabel;
  value: TValue;
};

export interface OptionsMapperType {
  Shipment: {
    trackWith: TrackWithType[];
    tags: null;
  };
  User: {
    filterByActive: IRecord<string, boolean>[];
    filterByRole: IRecord<string, RoleType>[];
  };
  Assign: {
    childId: IRecord<string, number>[];
    parentId: IRecord<string, number>[];
  };
}

type OptionsSelectorType = "Shipment" | "User" | "Assign";
interface FilterProps<T extends OptionsSelectorType> {
  optionsMapper: OptionsMapperType[T];
  type: T;
  defaultValue: keyof OptionsMapperType[T];
}

interface TemporaryFilterState {
  filterName: string;
  value: string | null | string[];
}

const Filter = <T extends OptionsSelectorType>({
  optionsMapper,
  type,
  defaultValue,
}: FilterProps<T>) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { querySetter } = useQueryUpdater();
  const searchParams = useSearchParams();
  const objectKeys = Object.keys(
    optionsMapper,
  ) as (keyof OptionsMapperType[T])[];
  const [optionKey, setOptionKey] =
    useState<keyof OptionsMapperType[T]>(defaultValue);
  const [filterBuilder, setFilterBuilder] = useState<
    TemporaryFilterState | undefined
  >({
    filterName: optionKey as string,
    value: String(
      Array.isArray(optionsMapper?.[optionKey])
        ? optionsMapper?.[optionKey]?.[0]
        : "",
    ),
  });

  const handleAddFilter = () => {
    if (filterBuilder) {
      if (Array.isArray(filterBuilder.value)) {
        querySetter(filterBuilder?.filterName, filterBuilder?.value);
      } else {
        if (filterBuilder.value !== searchParams.get(optionKey as string)) {
          querySetter(
            filterBuilder?.filterName,
            filterBuilder?.value as string,
          );
        }
      }
    }
  };
  const onFilterValueChange = (value: string | string[]) => {
    setFilterBuilder({ filterName: optionKey as string, value: value });
  };
  const removeFilterValue = (key: string, value: string) => {
    querySetter(key, value);
  };
  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        className="flex justify-center items-center gap-2 bg-blue-500"
      >
        <SearchIcon /> Filter{" "}
      </Button>
      <ModalCustom isOpen={openModal} onClose={() => setOpenModal(false)}>
        <DialogHeader>
          <DialogTitle className="text-start font-normal text-zinc-800">
            Filters
          </DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="w-full  bg-white ">
          <div className="flex items-center space-x-2 ">
            <div className="relative flex flex-row-reverse w-[100%]">
              <Select
                onValueChange={(val) => {
                  setOptionKey(val as keyof OptionsMapperType[T]);
                  setFilterBuilder(undefined);
                }}
                defaultValue={filterBuilder?.filterName}
              >
                <SelectTrigger
                  id="id"
                  className="!rounded-l-none    border-[1px] border-l-0 ring-0 focus:ring-0"
                >
                  <SelectValue placeholder="Select Options" />
                </SelectTrigger>
                <SelectContent className="overflow-y-auto max-h-[10rem] flex-col">
                  {objectKeys?.map((option, index) => {
                    return (
                      <SelectItem value={option as string} key={index}>
                        {option as string}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <div className="relative left-0 top-0 flex items-center justify-center px-3 bg-[#f7f7f7]  border-[1px] ">
                <FilterIcon
                  fill="#6c757d"
                  size={"20px"}
                  className="text-[#6c757d] "
                />
              </div>
            </div>
          </div>

          <div className="relative flex flex-row-reverse w-[100%] mt-2">
            {Array.isArray(optionsMapper[optionKey]) ? (
              <Select
                onValueChange={onFilterValueChange}
                defaultValue={filterBuilder?.value as string}
              >
                <SelectTrigger
                  id="equal"
                  className="!rounded-l-none    border-[1px] border-l-0 ring-0 focus:ring-0 capitalize"
                >
                  <SelectValue placeholder="Select a Value" />
                </SelectTrigger>
                <SelectContent className="overflow-y-auto max-h-[10rem] flex-initial">
                  {optionsMapper?.[optionKey]?.map((option, index) => {
                    return (
                      <SelectItem
                        value={option.value.toString()}
                        key={index}
                        className=" capitalize"
                      >
                        {option.label.toString()}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <TagsInput
                onChange={onFilterValueChange}
                value={filterBuilder?.value as string[]}
                classNames={{
                  input: "!rounded-l-none  !w-[400px]",
                  tag: "filter-cross-button",
                }}
              />
            )}
            <div className="relative left-0 top-0 flex items-center justify-center px-3 bg-[#f7f7f7]  border-[1px] ">
              <SearchIcon className="text-[#6c757d] text-xs" size={"20px"} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              className="bg-blue-500 text-white gap-2"
              onClick={handleAddFilter}
              disabled={!filterBuilder}
            >
              {searchParams.has(optionKey as string) ? (
                <>
                  <RefreshCw className="text-sm text-blue-500 bg-white rounded-full" />
                  {"Change Filter"}
                </>
              ) : (
                <>
                  <PlusCircle className="text-sm text-blue-500 bg-white rounded-full" />
                  {"Add Filter"}
                </>
              )}
            </Button>
          </div>
        </div>
        <Separator />

        {Array.from(searchParams)
          ?.filter(([key]) => {
            return key !== "page" && key !== "limit" && key !== "search";
          })
          ?.map(([key, value], index) => {
            return (
              <div
                className="flex  p-2 h-10 w-100% rounded-lg justify-between border-gray-400 border-[1px]"
                key={index}
              >
                <div className="flex gap-3">
                  <Badge className="bg-blue-600">{key} </Badge>
                  <Badge className="bg-slate-800">Equals</Badge>
                  <Badge className="bg-zinc-900 capitalize">
                    {value.split("_").join(" ")?.toLowerCase()}
                  </Badge>
                </div>
                <XCircle
                  fill="gray"
                  className="text-white cursor-pointer"
                  onClick={() => removeFilterValue(key, value)}
                />
              </div>
            );
          })}
      </ModalCustom>
    </>
  );
};

export default Filter;
