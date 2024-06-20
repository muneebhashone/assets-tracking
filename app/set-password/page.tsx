import SetPassword from "@/components/SetPassword";
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
  return <SetPassword token={searchParams.token} />;
};

export default page;
