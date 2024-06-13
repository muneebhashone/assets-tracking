"use client";
import { Shipment } from "@/services/shipment.queries";
import Link from "next/link";

interface CellActionProps {
  data: Shipment;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  return (
    <>
      <Link
        href={`/dashboard/shipment/${data.id}`}
        className="hover:text-blue-400"
      >
        View Details
      </Link>
    </>
  );
};
