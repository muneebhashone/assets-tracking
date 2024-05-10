"use client";
import { Shipment } from "@prisma/client";
// import { User } from "@/constants/data";
import Link from "next/link";

interface CellActionProps {
  data: Shipment;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  return (
    <>
      <Link
        href={`/dashboard/shipment/${data.tracking_number}`}
        className="hover:text-blue-400"
      >
        View Details
      </Link>
    </>
  );
};
