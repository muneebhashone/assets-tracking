import ShipmentNotFound from "@/components/error-page/shipment-not-found";
import { GoogleMap } from "@/components/google-map/map";
import React from "react";
import { Metadata } from "next";
interface PageProps {
  searchParams: { query?: string };
}

export const metadata: Metadata = {
  title: "Fratezone - Live Location",
  description: "Track your shipment in real-time",
};

const LiveLocationPage: React.FC<PageProps> = ({ searchParams }) => {
  const { query } = searchParams;

  if (!query) {
    return <ShipmentNotFound />;
  }

  return <GoogleMap shipmentId={Number(query)} className="h-[100vh] w-full" />;
};

export default LiveLocationPage;
