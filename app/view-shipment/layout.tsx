import Header from "@/components/layout/header";
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";

export const metadata: Metadata = {
  title: "Fratezone - View Shipment",
  description: "View your shipment",
};

const ViewShipmentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <Header />
      <main className="w-full pt-16 overflow-y-auto">{children}</main>
    </Suspense>
  );
};

export default ViewShipmentLayout;
