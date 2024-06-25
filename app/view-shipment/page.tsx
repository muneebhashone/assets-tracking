import ViewShipmentPage from "@/components/ViewShipmentPage";
import { redirect } from "next/navigation";
import React from "react";
interface PageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}
const Page = (props: PageProps) => {
  const { searchParams } = props;
  const token = searchParams["token"];
  if (!token) {
    redirect("/");
  }
  return <ViewShipmentPage token={token} />;
};

export default Page;
