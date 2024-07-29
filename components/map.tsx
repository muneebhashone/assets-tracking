"use client";

import dynamic from "next/dynamic";
import { DynamicMapProps } from "./dynamic-map";

const DynamicMap = dynamic(() => import("./dynamic-map"), {
  ssr: false,
});

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

const Map = (props: DynamicMapProps) => {
  const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = props;
  return (
    <div style={{ aspectRatio: width / height }}>
      <DynamicMap {...props} />
    </div>
  );
};

export default Map;
