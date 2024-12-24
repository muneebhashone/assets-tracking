import ResetPasswordPage from "@/components/page-client/ResetPasswordPage";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
interface PageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

export const metadata: Metadata = {
  title: "Fratezone - Reset Password",
  description: "Reset your password",
};

const page = ({ searchParams }: PageProps) => {
  if (!searchParams.token) {
    redirect("/");
  }
  return <ResetPasswordPage token={searchParams.token} />;
};

export default page;
