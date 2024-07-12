import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { navItems } from "@/constants/data";
import { currentUser } from "@/services/auth.services";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import React, { ReactNode, Suspense } from "react";

const SupportRequestLayout = async ({ children }: { children: ReactNode }) => {
  let user;
  try {
    user = (await currentUser(cookies().get("accessToken")?.value)).user;
  } catch (err) {}
  return (
    <Suspense>
      <NextTopLoader showSpinner={false} color="#D3991F" />
      <Header />
      <div className="flex h-screen overflow-hidden">
        {user && <Sidebar navItems={navItems} />}
        <main className="w-full pt-16 overflow-y-auto">{children}</main>
      </div>
    </Suspense>
  );
};

export default SupportRequestLayout;
