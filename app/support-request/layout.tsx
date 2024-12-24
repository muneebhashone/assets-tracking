import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { navItems } from "@/constants/data";
import { AUTH_KEY } from "@/utils/constants";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ReactNode, Suspense } from "react";

export const metadata: Metadata = {
  title: "Fratezone - Support Request",
  description: "Create a support request",
};
const SupportRequestLayout = async ({ children }: { children: ReactNode }) => {
  const cookieValue = cookies().get(AUTH_KEY)?.value;
  const accessToken = Boolean(cookieValue && cookieValue !== "undefined");

  return (
    <>
      <Suspense>
        <Header />
        <div className="flex h-screen overflow-hidden">
          {accessToken && <Sidebar navItems={navItems} />}
          <main className="w-full pt-16 overflow-y-auto">{children}</main>
        </div>
      </Suspense>
    </>
  );
};

export default SupportRequestLayout;
