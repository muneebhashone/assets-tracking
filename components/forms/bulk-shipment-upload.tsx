"use client";

import { Button } from "@/components/ui/button";
import { useCreateBulkShipment } from "@/services/upload.mutations";
import { Cross2Icon, FileIcon, UploadIcon } from "@radix-ui/react-icons";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "../ui/use-toast";

type FormData = {
  file: File | null;
};

const BulkShipmentUploader: React.FC<{
  setIsBulkUpload: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsBulkUpload }) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: { file: null },
  });
  const file = watch("file");
  const { mutate: createBulkShipment, isPending } = useCreateBulkShipment({
    onSuccess(data) {
      toast({
        variant: "default",
        description: data.message,
        title: "Success",
      });
      setIsBulkUpload(false);
      reset();
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
      if (acceptedFiles && acceptedFiles[0]) {
        setValue("file", acceptedFiles[0]);
      }
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
        ".csv",
      ],
    },
    multiple: false,
  });

  const handleUpload = async (data: FormData) => {
    if (!data.file) return;

    const { file } = data;
    const formData = new FormData();
    formData.append("file", file as Blob);
    createBulkShipment(formData);
  };

  const removeFile = () => {
    reset(); // This will reset the form, including the file input
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpload)}
      className="bg-gray-100 p-6 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Excel Upload</h2>
      <p className="text-gray-600 mb-4">
        Using the sample Excel files below, you can track multiple shipments.
      </p>

      <div className="flex space-x-4 mb-6">
        <div className="flex items-center">
          <FileIcon className="text-green-600 mr-2" />
          <span className="text-blue-500">TrackingExcelSample.xlsx</span>
          <span className="ml-2 text-xs bg-orange-500 text-white px-1 rounded">
            Old
          </span>
        </div>
        <div className="flex items-center">
          <FileIcon className="text-green-600 mr-2" />
          <span className="text-blue-500">TrackingExcelSampleNew.xlsx</span>
          <span className="ml-2 text-xs bg-green-500 text-white px-1 rounded">
            New
          </span>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer ${
          isDragActive ? "bg-blue-50" : ""
        }`}
      >
        <input {...getInputProps()} {...register("file")} />
        <UploadIcon className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">
          {isDragActive
            ? "Drop the file here"
            : "Drag and drop a file here or click"}
        </p>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Only .xlsx extension (Excel File) is accepted.
      </p>

      {file && (
        <div className="mt-2 flex items-center">
          <p className="text-sm text-green-600 flex-grow">
            Selected file: {file.name}
          </p>
          <Button
            type="button"
            onClick={removeFile}
            className="bg-red-500 h-6 w-6 text-white hover:bg-red-600 p-1"
          >
            <Cross2Icon />
          </Button>
        </div>
      )}

      <div className="flex space-x-4 mt-4">
        <Button
          type="submit"
          className="bg-blue-500 text-white hover:bg-blue-600"
          disabled={!file || isPending}
        >
          {isPending ? "Processing..." : "Upload and Process"}
        </Button>
      </div>
    </form>
  );
};

export default BulkShipmentUploader;
