import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";

type props = {
  children: React.ReactNode;
};
export default function DashboardLayout({ children }: props) {
  return (
    <Suspense>
      <NextTopLoader showSpinner={false} />
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16 overflow-y-auto">{children}</main>
      </div>
    </Suspense>
  );
}
