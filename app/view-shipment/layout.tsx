import Header from "@/components/layout/header";
import { ReactNode, Suspense } from "react";

const ViewShipmentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <Header />
      <main className="w-full pt-16 overflow-y-auto">{children}</main>
    </Suspense>
  );
};

export default ViewShipmentLayout;
