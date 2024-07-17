"use client";

import { useShipmentFileUpload } from "@/services/upload.mutations";
import { CSSProperties, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { ModalCustom } from "../ModalComponent";
import { DialogHeader } from "../ui/dialog";
import { toast } from "../ui/use-toast";

const baseStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  height: "100%",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  cursor: "pointer",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};
const UploadShipmentFile = ({
  modalOpen,
  setModalOpen,
  shipmentId,
}: {
  modalOpen: boolean;
  setModalOpen: (state: boolean) => void;
  shipmentId: number;
}) => {
  const { mutate: uploadShipmentFile } = useShipmentFileUpload({
    async onSuccess(data) {
      toast({
        variant: "default",
        description: data.message,
        title: "Success",
      });
      acceptedFiles.splice(0);
      setModalOpen(false);
    },
    onError(error) {
      toast({
        variant: "destructive",
        description: error.response?.data.message,
        title: "Error",
      });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const formdata = new FormData();
      formdata.set("files", acceptedFiles?.[0]);
      uploadShipmentFile({ files: formdata, shipmentId });
    },
    [uploadShipmentFile, shipmentId],
  );

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ onDrop, multiple: false });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  return (
    <ModalCustom
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      className="border-r-[20%] bg-slate-200 h-[300px]"
    >
      <div className="container h-[70%]">
        <DialogHeader className="text-gray-500 font-semibold text-lg mb-4">
          Upload Files
        </DialogHeader>
        <div {...getRootProps({ style })}>
          <input {...getInputProps()}  />
          {acceptedFiles?.length ? (
            <p className="text-center ">File Uploaded</p>
          ) : (
            <p className="text-center align-middle">
              Drag and drop some files here, or click to select files
            </p>
          )}
        </div>
      </div>
    </ModalCustom>
  );
};

export default UploadShipmentFile;
