import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { navItems } from "@/constants/data";
import { Suspense } from "react";

type props = {
  children: React.ReactNode;
};
export default function DashboardLayout({ children }: props) {
  return (
    <Suspense>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar navItems={navItems} />
        <main className="w-full pt-16 overflow-y-auto">{children}</main>
      </div>
    </Suspense>
  );
}
