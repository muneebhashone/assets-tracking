"use client";

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import "leaflet-defaulticon-compatibility";
// END: Preserve spaces to avoid auto-sorting
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { LatLngExpression } from "leaflet";

interface MapProps {
  width?: string | number;
  height?: string | number;
  center?: number[];
}

const DEFAULT_WIDTH = "600px";
const DEFAULT_HEIGHT = "400px";
const DEFAULT_CENTER = [51.505, -0.09];

export default function Map({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  center = DEFAULT_CENTER,
}: MapProps) {
  return (
    <MapContainer
      preferCanvas={true}
      center={center as LatLngExpression}
      zoom={11}
      scrollWheelZoom={true}
      style={{ height: height, width: width }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center as LatLngExpression}>
        <Popup>
          This Marker icon is displayed correctly with{" "}
          <i>leaflet-defaulticon-compatibility</i>.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
