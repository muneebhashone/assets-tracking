import ShipmentNotFound from "@/components/error-page/shipment-not-found";
import { GoogleMap } from "@/components/google-map/map";
import React from "react";

interface PageProps {
  searchParams: { query?: string }; // Make shipmentId optional
}

const LiveLocationPage: React.FC<PageProps> = ({ searchParams }) => {
  const { query } = searchParams;

  if (!query) {
    return <ShipmentNotFound />;
  }

  // If shipmentId is provided, render the GoogleMap component
  return <GoogleMap shipmentId={Number(query)} className="h-[100vh] w-full" />;
};

export default LiveLocationPage;
