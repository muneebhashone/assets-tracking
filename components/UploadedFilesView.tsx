"use client";
import { Shipment } from "@/services/shipment.queries";
import { File, FileText } from "lucide-react";
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
              data.files.map((file, index) => {
                const fileName = decodeURIComponent(file).split("/").pop();
                return (
                  <Link
                    href={file}
                    target="_blank"
                    className="flex justify-center items-center flex-col bg-white rounded-md p-4 transition-all hover:bg-slate-100 cursor-pointer"
                    key={index}
                  >
                    <FileText className="w-20 h-20 text-blue-500" />
                    <p className="text-xs text-center">{fileName}</p>
                  </Link>
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
