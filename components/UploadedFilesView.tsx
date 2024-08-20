"use client";
import { Shipment } from "@/services/shipment.queries";
import { File, FileText, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ModalCustom } from "./ModalComponent";
import { DialogHeader } from "./ui/dialog";

const UploadedFilesView = ({ data }: { data: Shipment }) => {
  const [modalState, setModalState] = useState<boolean>(false);

  return (
    <>
      <ModalCustom
        isOpen={modalState}
        onClose={() => setModalState(false)}
        className="border-r-[20%] bg-slate-200"
      >
        <>
          <DialogHeader className="text-gray-500 font-semibold text-lg mb-4">
            Uploaded Files
          </DialogHeader>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {data?.files?.length ? (
              data?.files?.map((file, index) => {
                const fileName = decodeURIComponent(file).split("/").pop();
                return (
                  <>
                    <div
                      className="flex justify-center items-center flex-col bg-white p-4 rounded-md  transition-all hover:bg-slate-100 cursor-pointer relative"
                      key={index}
                    >
                      <X className="absolute right-0 top-0 z-[999] text-red-600  transition-colors duration-300 transform hover:text-black" />
                      <FileText className="w-20 h-20 text-blue-500" />

                      <Link
                        href={file}
                        target="_blank"
                        className="text-xs text-center font-semibold text-blue-950 transition-colors duration-300 transform hover:text-black"
                      >
                        {fileName}
                      </Link>
                    </div>
                  </>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </>
      </ModalCustom>
      <span
        className="hover:text-blue-500 cursor-pointer flex items-center"
        onClick={() => setModalState(true)}
      >
        <File className="mr-2 h-4 w-4" />
        <span>View</span>
      </span>
    </>
  );
};

export default UploadedFilesView;
