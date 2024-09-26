"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircledIcon, PlusIcon } from "@radix-ui/react-icons";

import { useState } from "react";
import BulkShipmentUploader from "./forms/bulk-shipment-upload";
import { ModalCustom } from "./ModalComponent";
import ShipmentCreationForm from "./forms/shipment-creation-form";

export default function AllShipmentCreationDropDown() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isBulkUpload, setIsBulkUpload] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="border rounded-md bg-[#D3991F] text-white hover:bg-[#bf8c1e]">
            Create <PlusCircledIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => {
              setIsBulkUpload(false);
              setModalOpen(true);
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            <span>Single Shipment</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() => {
              setIsBulkUpload(true);
              setModalOpen(true);
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            <span>Bulk Shipments</span>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalCustom
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-h-[70vh] overflow-auto min-w-[45rem] mild-scrollbar backdrop-opacity-50"
      >
        {isBulkUpload ? (
          <BulkShipmentUploader setIsBulkUpload={setIsBulkUpload} />
        ) : (
          <ShipmentCreationForm setModalOpen={setModalOpen} />
        )}
      </ModalCustom>
    </>
  );
}
