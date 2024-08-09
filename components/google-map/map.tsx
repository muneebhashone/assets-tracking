import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";
type GoogleMapProps = {
  positions?: {
    lat: number;
    lng: number;
  }[];

  checkpoints?: {
    lat: number;
    lng: number;
  }[];
  currentLocation?: {
    lat: number;
    lng: number;
  };
};
export function GoogleMap({
  positions,
  checkpoints,
  currentLocation,
}: GoogleMapProps) {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
      version: "weekly",
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          zoom: 3,
          minZoom: 3,
          center: currentLocation ?? { lat: 0, lng: -180 },
          mapTypeId: "terrain",
        });
        if (positions) {
          const polyLine = new google.maps.Polyline({
            path: positions,
            geodesic: true,
            strokeColor: "blue",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });

          polyLine.setMap(map);

          const addMarker = (
            position: google.maps.LatLng | google.maps.LatLngLiteral,
            title: string,
            icon: google.maps.Icon | string,
          ) => {
            new google.maps.Marker({
              position,
              map,
              title,
              icon,
            });
          };

          if (currentLocation) {
            addMarker(
              currentLocation,
              `Pin Location`,
              "https://maps.google.com/mapfiles/kml/paddle/red-circle.png",
            );
          }
          if (checkpoints && checkpoints?.length) {
            checkpoints?.map((checkpoint, index) =>
              addMarker(
                checkpoint,
                `Checkpoint ${index + 1}`,
                `https://maps.google.com/mapfiles/kml/pal3/icon${index}.png`,
              ),
            );
          }
        }
      }
    });
  }, [checkpoints, currentLocation, positions]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
}
