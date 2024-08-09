import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
type GoogleMapProps = {
  positions?: {
    lat: number;
    lng: number;
  }[];

  checkpoints: {
    lat: number;
    lng: number;
  }[];
};
export function GoogleMap({ positions, checkpoints }: GoogleMapProps) {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyDe_fLxQFXdTRd7JsWf2MiHzwjMhIupJ0A",
      version: "weekly",
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          zoom: 3,
          center: { lat: 0, lng: -180 },
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

          checkpoints.map((checkpoint, index) =>
            addMarker(
              checkpoint,
              `Checkpoint ${index}`,
              "https://maps.google.com/mapfiles/kml/shapes/shaded_dot.png",
            ),
          );
        }
      }
    });
  }, []);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
}
