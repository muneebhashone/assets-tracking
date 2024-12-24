import CreateShipmentPage from "@/components/page-client/CreateShipmentPage";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fratezone - Create Shipment",
  description: "Create a new shipment",
};

const page = () => {
  return <CreateShipmentPage />;
};

export default page;
