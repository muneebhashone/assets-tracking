"use client";

import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import L, { LatLngExpression } from "leaflet";
import "leaflet-defaulticon-compatibility";
import {
  CircleMarker,
  LayerGroup,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

interface MapProps {
  width?: string | number;
  height?: string | number;
  center?: number[];
  positions?: LatLngExpression[] | LatLngExpression[][];
  checkpoints?: LatLngExpression[];
}

const DEFAULT_WIDTH = "600px";
const DEFAULT_HEIGHT = "400px";
const DEFAULT_CENTER = [51.505, -0.09];
const mapTilesKey = process.env.NEXT_PUBLIC_MAP_TILES_API_KEY || "";

export default function Map({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  center = DEFAULT_CENTER,
  positions,
  checkpoints,
}: MapProps) {
  return (
    <MapContainer
      preferCanvas={true}
      center={center as LatLngExpression}
      zoom={3}
      maxZoom={12}
      minZoom={6}
      scrollWheelZoom={true}
      style={{ height: height, width: width }}
    >
      <TileLayer
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        url={`https://api.maptiler.com/maps/bright-v2/256/{z}/{x}/{y}.png?key=${mapTilesKey}`}
      />
      <LayerGroup>
        {positions && Boolean(positions?.length) && (
          <Polyline pathOptions={{ color: "#1176aa" }} positions={positions} />
        )}
        {checkpoints &&
          Boolean(checkpoints?.length) &&
          [...checkpoints, center]?.map((checkpoint, index) => {
            const Text = L.divIcon({
              html: String(index + 1),
              className: "text-center font-bold !mt-[-8px]",
            });

            return (
              <CircleMarker
                center={checkpoint as LatLngExpression}
                pathOptions={{
                  color: "black",
                  fillColor: "white",
                  fillOpacity: 1,
                  weight: 0.8,
                }}
                key={index}
                radius={10}
              >
                {" "}
                <Marker position={checkpoint as LatLngExpression} icon={Text} />
              </CircleMarker>
            );
          })}
        <Marker position={center as LatLngExpression}>
          <Popup>
            This Marker icon is displayed correctly with{" "}
            <i>leaflet-defaulticon-compatibility</i>.
          </Popup>
        </Marker>
      </LayerGroup>
    </MapContainer>
  );
}
