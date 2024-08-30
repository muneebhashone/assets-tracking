export type Container = {
  id: number;
  shipmentId: number | null;
  emptyToShipper: Date | null;
  containerNumber: string;
  gateIn: Date | null;
  gateOut: Date | null;
  emptyReturn: Date | null;
  sizeType: string | null;
};

export type Movement = {
  date: Date | null;
  id: number;
  shipmentId: number | null;
  location: TLocation;
  description: string | null;
  actual: boolean | null;
  vessel: Vessel;
};

export type POL = {
  date: string;
  location: TLocation;
  actual: boolean;
};

export type POD = {
  date: string;
  location: TLocation;
  predictive_eta: string;
  actual: boolean;
};
export type Vessel = {
  id: string;
  imo: number;
  flag: string;
  mmsi: number;
  name: string;
  call_sign: string;
};
export type TLocation = {
  id: number;
  lat: number;
  lng: number;
  name: string;
  state: string;
  locode: string;
  country: string;
  timezone: string;
  country_code: string;
};
