import ResetPassword from "@/components/ResetPassword";
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
  return <ResetPassword token={searchParams.token} />;
};

export default page;
