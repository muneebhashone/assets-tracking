import SetPasswordPage from "@/components/page-client/SetPasswordPage";
import { redirect } from "next/navigation";
import React from "react";
interface PageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}
const page = ({ searchParams }: PageProps) => {
  if (!searchParams.token) {
    redirect("/");
  }
  return <SetPasswordPage token={searchParams.token} />;
};

export default page;
