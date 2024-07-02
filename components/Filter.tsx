"use client";

import useQueryUpdater from "@/hooks/useQueryUpdater";
import { FilterIcon, PlusCircle, SearchIcon, XCircle } from "lucide-react";
import { useState } from "react";
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
import { Options } from "./ui/combobox";
import { RoleType, StatusType } from "@/types/user.types";
import { z } from "zod";
import { EligibleRolesForCreation } from "@/utils/constants";
import { useSearchParams } from "next/navigation";

type EligibleRolesForCreationType = typeof EligibleRolesForCreation;

type RoleMapping =
  EligibleRolesForCreationType[keyof EligibleRolesForCreationType];
export interface OptionsMapperType {
  filterByStatus: StatusType[];
  filterByActive: boolean[];
  filterByRole: RoleMapping;
}

interface FilterProps {
  optionsMapper: OptionsMapperType;
}
const Filter = ({ optionsMapper }: FilterProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { querySetter } = useQueryUpdater();
  const searchParams = useSearchParams();
  const objectKeys = Object.keys(optionsMapper);
  const [optionKey, setOptionKey] =
    useState<keyof OptionsMapperType>("filterByStatus");
  const [filterBuilder, setFilterBuilder] = useState();

  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        className="flex justify-center items-center gap-2"
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
                onValueChange={(val: keyof OptionsMapperType) =>
                  setOptionKey(val)
                }
              >
                <SelectTrigger
                  id="id"
                  className="!rounded-l-none   border-gray-500 border-[1px] border-l-0 ring-0 focus:ring-0"
                >
                  <SelectValue placeholder="Select Options" />
                </SelectTrigger>
                <SelectContent className="overflow-y-auto max-h-[10rem] flex-col">
                  {objectKeys?.map((option) => {
                    return <SelectItem value={option}> {option}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
              <div className="relative left-0 top-0 flex items-center justify-center px-3 bg-[#f7f7f7] border-gray-500 border-[1px] ">
                <FilterIcon
                  fill="#6c757d"
                  size={"20px"}
                  className="text-[#6c757d] "
                />
              </div>
            </div>
            {/* <div className="relative flex flex-row-reverse w-[50%]">
              <Select>
                <SelectTrigger
                  id="equal"
                  className="!rounded-l-none   border-gray-500 border-[1px] border-l-0 ring-0 focus:ring-0"
                >
                  <SelectValue placeholder="Equal" />
                </SelectTrigger>
                <SelectContent className="overflow-y-auto max-h-[10rem] flex-initial">
                  <SelectItem value="equal"> Equal</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative left-0 top-0 flex items-center justify-center px-3 bg-[#f7f7f7] border-gray-500 border-[1px] ">
                <EyeIcon className="text-[#6c757d] text-xs" size={"20px"} />
              </div>
            </div> */}
          </div>

          {/* <div className="mt-2">
            <Input />
          </div> */}

          <div className="relative flex flex-row-reverse w-[100%] mt-2">
            <Select
              onValueChange={(value) => {
                // querySetter(optionKey, value);
                setFilterBuilder(value);
              }}
            >
              <SelectTrigger
                id="equal"
                className="!rounded-l-none   border-gray-500 border-[1px] border-l-0 ring-0 focus:ring-0"
              >
                <SelectValue placeholder="Equal" />
              </SelectTrigger>
              <SelectContent className="overflow-y-auto max-h-[10rem] flex-initial">
                {/* <SelectItem value="equal"> Equal</SelectItem> */}

                {optionsMapper[optionKey]?.map((option) => {
                  return (
                    <SelectItem value={option.toString()}>
                      {" "}
                      {option.toString()}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <div className="relative left-0 top-0 flex items-center justify-center px-3 bg-[#f7f7f7] border-gray-500 border-[1px] ">
              <SearchIcon className="text-[#6c757d] text-xs" size={"20px"} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="bg-blue-500 text-white gap-2" onClick={()=>querySetter(optionKey,)}>
              <PlusCircle className="text-sm text-blue-500 bg-white rounded-full" />
              Add Filter
            </Button>
          </div>
        </div>
        <Separator />

        <div className="flex  p-2 h-10 w-100% rounded-lg justify-between border-gray-500 border-[1px]">
          <div className="flex gap-3">
            <Badge className="bg-blue-600">Pol </Badge>
            <Badge className="bg-slate-800">in</Badge>
            <Badge className="bg-zinc-900">Albania</Badge>
          </div>
          <XCircle fill="gray" className="text-white " />
        </div>
      </ModalCustom>
    </>
  );
};

export default Filter;
