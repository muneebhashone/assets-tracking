import { AISType } from "@/services/shipment.queries";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

type GoogleMapProps = {
  ais?: AISType;
  positions?: {
    lat: number;
    lng: number;
    transport_type: string;
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
  ais,
}: GoogleMapProps) {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
      version: "weekly",
      libraries: ["geocoding"],
    });

    loader.load().then(async () => {
      if (mapRef.current && positions) {
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
          icon?: google.maps.Icon | string,
          zIndex?: number
        ) => {
          new google.maps.Marker({
            position,
            map,
            title,
            label: label,
            icon: icon,
            zIndex: zIndex || 99
          });
        };

        // Find the index of current location
        const currentIndex = positions.findIndex(
          (p) => p.lat === currentLocation?.lat && p.lng === currentLocation?.lng
        );

        // Plot routes
        const plotRoute = (routePositions: typeof positions, isSolid: boolean) => {
          const polyline = new google.maps.Polyline({
            path: routePositions,
            geodesic: false,
            strokeColor: "#000066",
            strokeOpacity: isSolid ? 0.6 : 0,
            strokeWeight: 2,
            icons: isSolid ? undefined : [{
              icon: {
                path: "M 0,-1 0,1",
                strokeOpacity: 0.6,
                scale: 3,
              },
              offset: "0",
              repeat: "20px",
            }],
          });
          polyline.setMap(map);
        };

        // Plot VESSEL routes
        const vesselPositions = positions.filter(p => p.transport_type === "VESSEL");
        if (vesselPositions.length > 0) {
          const coveredVesselPositions = vesselPositions.slice(0, currentIndex + 1);
          const uncoveredVesselPositions = vesselPositions.slice(currentIndex);
          
          plotRoute(coveredVesselPositions, true);
          plotRoute(uncoveredVesselPositions, false);
        }

        // Plot non-VESSEL routes using Directions API
        const nonVesselSegments = positions.reduce((acc, curr, index, arr) => {
          if (curr.transport_type !== "VESSEL" && index < arr.length - 1 && arr[index + 1].transport_type !== "VESSEL") {
            acc.push({
              start: curr,
              end: arr[index + 1],
              isCovered: index <= currentIndex
            });
          }
          return acc;
        }, [] as { start: typeof positions[0], end: typeof positions[0], isCovered: boolean }[]);

        for (const segment of nonVesselSegments) {
          const request = {
            origin: { lat: segment.start.lat, lng: segment.start.lng },
            destination: { lat: segment.end.lat, lng: segment.end.lng },
            travelMode: google.maps.TravelMode.DRIVING,
          };

          directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              const polyline = new google.maps.Polyline({
                path: result?.routes[0].overview_path,
                geodesic: false,
                strokeColor: "#000066",
                strokeOpacity: segment.isCovered ? 0.6 : 0,
                strokeWeight: 2,
                icons: segment.isCovered ? undefined : [{
                  icon: {
                    path: "M 0,-1 0,1",
                    strokeOpacity: 0.8,
                    scale: 3,
                  },
                  offset: "0",
                  repeat: "20px",
                }],
              });
              polyline.setMap(map);
            }
          });
        }

        // Add markers and other existing functionality
        addMarker(
          positions.at(-1) as google.maps.LatLng | google.maps.LatLngLiteral,
          `Pin Location`,
          undefined, undefined, 999
        );

        if (checkpoints && checkpoints?.length) {
          const svgUrl = {
            url: "data:image/svg+xml;base64," + btoa(`
              <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="10" stroke="#000000" stroke-width="2" fill="#ffffff"/>
              </svg>
            `),
            anchor: new google.maps.Point(50, 50),
          };
          checkpoints?.forEach((checkpoint, index) =>
            addMarker(
              checkpoint,
              `Checkpoint ${index + 1}`,
              `${index + 1}`,
              svgUrl,
            ),
          );
        }

        // Add current location marker
        if (currentLocation && ais?.status === "OK") {
          addMarker(currentLocation, ais.data.vessel.name, undefined, {
            url: "/images/animated-loc.svg",
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25),
          });
        }
      }
    });
  }, [checkpoints, currentLocation, positions, ais]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
}