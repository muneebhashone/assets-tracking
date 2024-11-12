import SetPasswordPage from "@/components/page-client/SetPasswordPage";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
interface PageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

export const metadata: Metadata = {
  title: "Fratezone - Set Password",
  description: "Set your password",
};

const page = ({ searchParams }: PageProps) => {
  if (!searchParams.token) {
    redirect("/");
  }
  return <SetPasswordPage token={searchParams.token} />;
};

export default page;
