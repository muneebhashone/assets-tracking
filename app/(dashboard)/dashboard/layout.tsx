import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { auth } from "@/lib/auth-options";
import { ROLE } from "@/types";

// import { getSession, useSession } from "next-auth/react";

type props = {
  children: React.ReactNode;
};
export default async function DashboardLayout({ children }: props) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16 overflow-y-auto">{children}</main>
      </div>
    </>
  );
}
