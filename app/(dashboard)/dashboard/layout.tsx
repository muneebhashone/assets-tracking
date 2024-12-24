import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { navItems } from "@/constants/data";
import { Suspense } from "react";
import { Metadata } from "next";

type props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Fratezone - Dashboard",
  description: "Manage your account and view your dashboard",
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
