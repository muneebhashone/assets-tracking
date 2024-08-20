import { AISType } from "@/services/shipment.queries";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

type GoogleMapProps = {
  ais?: AISType;
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
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          zoom: 3,
          minZoom: 3,
          center: currentLocation ?? { lat: 0, lng: -180 },
          mapTypeId: "terrain",
        });
        const addMarker = (
          position: google.maps.LatLng | google.maps.LatLngLiteral,
          title: string,
          label?: google.maps.MarkerLabel | string,
          icon?: google.maps.Icon | string,
          zIndex?:number
        ) => {
          new google.maps.Marker({
            position,
            map,
            title,
            label: label,
            icon: icon,
            zIndex:zIndex  || 99
          });
        };
        if (positions) {
          addMarker(
            positions.at(-1) as google.maps.LatLng | google.maps.LatLngLiteral,
            `Pin Location`,
            undefined,undefined,999
          );

          if (checkpoints && checkpoints?.length) {
            const svgUrl = {
              url:
                "data:image/svg+xml;base64," +
                btoa(`
              <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <!-- White circle with black stroke -->
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
          
          const index = positions.findIndex(
            (p) =>
              p.lat === currentLocation?.lat && p.lng === currentLocation?.lng,
          );
          if (index === -1) return;
          if (ais?.status === "OK") {
            addMarker(positions[index], ais.data.vessel.name, undefined, {
              url: "/images/animated-loc.svg",
              scaledSize: new google.maps.Size(50, 50),
              anchor: new google.maps.Point(25, 25),
            });
          }
          const positionsBefore = positions.slice(0, index + 1);
          const positionsAfter = positions.slice(index);

          const solidPolyLine = new google.maps.Polyline({
            path: positionsBefore,
            geodesic: false,
            strokeColor: "#000066",
            strokeOpacity: 0.6,
            strokeWeight: 2,
          });

          solidPolyLine.setMap(map);

          const dottedPolyLine = new google.maps.Polyline({
            path: positionsAfter,
            geodesic: false,
            strokeColor: "#000066",
            strokeOpacity: 0,

            icons: [
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

          dottedPolyLine.setMap(map);
        }
      }
    });
  }, [checkpoints, currentLocation, positions, ais]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
}
