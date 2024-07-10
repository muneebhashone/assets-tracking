import Header from "@/components/layout/header";
import MainFooter from "@/components/MainFooter";
import NextTopLoader from "nextjs-toploader";
import React, { ReactNode, Suspense } from "react";

const ViewShipmentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <NextTopLoader showSpinner={false} color="#D3991F" />
      <Header />
      <main className="w-full pt-16 overflow-y-auto">{children}</main>
    </Suspense>
  );
};

export default ViewShipmentLayout;
