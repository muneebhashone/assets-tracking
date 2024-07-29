"use client";

import { useEffect } from "react";
import Leaflet from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";

const { MapContainer } = ReactLeaflet;

export interface DynamicMapProps {
  width: number;
  height: number;
  className?: string;
  children: (
    ReactLeaflet: typeof import("react-leaflet"),
    Leaflet: typeof import("leaflet"),
  ) => React.ReactNode;
  [key: string]: unknown;
}
const DynamicMap = ({
  children,
  className,
  width,
  height,
  ...rest
}: DynamicMapProps) => {
  let mapClassName = "";

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  useEffect(() => {
    (async function init() {
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
        iconUrl: "leaflet/images/marker-icon.png",
        shadowUrl: "leaflet/images/marker-shadow.png",
      });
    })();
  }, []);

  return (
    <MapContainer className={mapClassName} {...rest}>
      {children(ReactLeaflet, Leaflet)}
    </MapContainer>
  );
};

export default DynamicMap;
