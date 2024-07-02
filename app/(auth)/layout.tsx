import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { navItems } from "@/constants/data";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";

type props = {
  children: React.ReactNode;
};
export default function AuthLayout({ children }: props) {
  return (
    <Suspense>
      <NextTopLoader showSpinner={false} color="#D3991F" />
      {children}
    </Suspense>
  );
}
