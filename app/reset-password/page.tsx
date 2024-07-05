
import ResetPasswordPage from "@/components/page-client/ResetPasswordPage";
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
  return <ResetPasswordPage token={searchParams.token} />;
};

export default page;
