"use client";

import { useGetShipmentById } from "@/services/shipment.queries";
import { Loader } from "@googlemaps/js-api-loader";
import { HTMLAttributes, useEffect, useRef, useMemo } from "react";

// type RouteSegment = {
//   path: [number, number][];
//   type: string;
//   transport_type: string;
// };

// type GoogleMapProps = {
//   shipmentId: number;

// };

interface GoogleMapProps extends HTMLAttributes<HTMLDivElement> {
  shipmentId: number;
}
export function GoogleMap({ shipmentId, ...otherProps }: GoogleMapProps) {
  console.log({ shipmentId });
  const { data: shipmentData, isLoading } = useGetShipmentById({
    shipmentId: Number(shipmentId),
  });
  console.log({ shipmentData, isLoading });
  const routeData = shipmentData?.result?.routeData;

  const currentLocation = useMemo(() => {
    return shipmentData?.result?.currentLocation
      ? {
          lat: Number(shipmentData.result.currentLocation[0]),
          lng: Number(shipmentData.result.currentLocation[1]),
        }
      : undefined;
  }, [shipmentData?.result?.currentLocation]);

  const ais = shipmentData?.result?.ais;
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
      version: "weekly",
      libraries: ["geocoding"],
    });

    loader.load().then(async () => {
      if (mapRef.current && routeData) {
        const map = new google.maps.Map(mapRef.current, {
          zoom: 3,
          minZoom: 3,
          center: currentLocation ?? { lat: 0, lng: -180 },
          mapTypeId: "terrain",
        });

        const directionsService = new google.maps.DirectionsService();

        const addMarker = (
          position: google.maps.LatLng | google.maps.LatLngLiteral,
          title: string,
          label?: google.maps.MarkerLabel | string,
          icon?: google.maps.Icon | string | google.maps.Symbol,
          zIndex?: number,
        ) => {
          new google.maps.Marker({
            position,
            map,
            title,
            label: label,
            icon: icon,
            zIndex: zIndex || 99,
          });
        };

        const DISTANCE_THRESHOLD = 0.1;

        let currentSegmentIndex = -1;
        let currentPointIndex = -1;

        routeData.forEach((segment, segIndex) => {
          const pointIndex = segment.path.findIndex((point) => {
            if (!currentLocation) return false;
            const latDiff = Math.abs(point[0] - currentLocation.lat);
            const lngDiff = Math.abs(point[1] - currentLocation.lng);
            return latDiff < DISTANCE_THRESHOLD && lngDiff < DISTANCE_THRESHOLD;
          });

          if (pointIndex !== -1) {
            currentSegmentIndex = segIndex;
            currentPointIndex = pointIndex;
          }
        });

        const plotRoute = (path: [number, number][], isSolid: boolean) => {
          const polyline = new google.maps.Polyline({
            path: path.map((point) => ({ lat: point[0], lng: point[1] })),
            geodesic: false,
            strokeColor: "#000066",
            strokeOpacity: isSolid ? 0.6 : 0,
            strokeWeight: 2,
            icons: isSolid
              ? undefined
              : [
                  {
                    icon: {
                      path: "M 0,-1 0,1",
                      strokeOpacity: 0.6,
                      scale: 3,
                    },
                    offset: "0",
                    repeat: "20px",
                  },
                ],
          });
          polyline.setMap(map);
        };

        routeData.forEach((segment, segIndex) => {
          if (segment.transport_type === "VESSEL") {
            if (segIndex === currentSegmentIndex) {
              const coveredPath = segment.path.slice(0, currentPointIndex + 1);
              const uncoveredPath = segment.path.slice(currentPointIndex);
              plotRoute(coveredPath, true);
              plotRoute(uncoveredPath, false);
            } else {
              plotRoute(segment.path, segIndex < currentSegmentIndex);
            }
          } else {
            const start = segment.path[0];
            const end = segment.path[segment.path.length - 1];

            const isSolid =
              segIndex < currentSegmentIndex ||
              (segIndex === currentSegmentIndex &&
                segment.path.length - 1 <= currentPointIndex);

            const request = {
              origin: { lat: start[0], lng: start[1] },
              destination: { lat: end[0], lng: end[1] },
              travelMode: google.maps.TravelMode.DRIVING,
            };

            directionsService.route(request, (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                const polyline = new google.maps.Polyline({
                  path: result?.routes[0].overview_path,
                  geodesic: false,
                  strokeColor: "green",
                  strokeOpacity: isSolid ? 0.6 : 0,
                  strokeWeight: 2,
                  icons: isSolid
                    ? undefined
                    : [
                        {
                          icon: {
                            path: "M 0,-1 0,1",
                            strokeOpacity: 0.8,
                            scale: 3,
                          },
                          offset: "0",
                          repeat: "20px",
                        },
                      ],
                });
                polyline.setMap(map);
              }
            });
          }
        });

        routeData.forEach((segment, index) => {
          const first = segment.path[0];
          addMarker(
            { lat: first[0], lng: first[1] },
            `Checkpoint ${index + 1}`,
            `${index + 1}`,
            {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#ffffff",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#000000",
            },
          );

          if (index === routeData.length - 1) {
            const last = segment.path[segment.path.length - 1];
            addMarker(
              { lat: last[0], lng: last[1] },
              `Checkpoint ${index + 2}`,
              `${index + 2}`,
              {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#ffffff",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#000000",
              },
            );
          }
        });

        if (currentLocation && ais?.status === "OK") {
          addMarker(currentLocation, ais.data.vessel.name, undefined, {
            url: "/images/animated-loc.svg",
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25),
          });
        }

        const bounds = new google.maps.LatLngBounds();
        routeData.forEach((segment) => {
          segment.path.forEach((point) => {
            bounds.extend({ lat: point[0], lng: point[1] });
          });
        });
        map.fitBounds(bounds);
      }
    });
  }, [routeData, currentLocation, ais]);

  return <div ref={mapRef} id="map-tracking" {...otherProps} />;
}
