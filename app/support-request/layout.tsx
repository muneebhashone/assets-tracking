import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { navItems } from "@/constants/data";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { ReactNode, Suspense } from "react";

const SupportRequestLayout = async ({ children }: { children: ReactNode }) => {
  const cookieValue = cookies().get("accessToken")?.value;
  const accessToken = Boolean(cookieValue && cookieValue !== "undefined");

  return (
    <>
      <NextTopLoader showSpinner={false} color="#D3991F" />
      <Header />
      <div className="flex h-screen overflow-hidden">
        {accessToken && <Sidebar navItems={navItems} />}
        <main className="w-full pt-16 overflow-y-auto">{children}</main>
      </div>
    </>
  );
};

export default SupportRequestLayout;
