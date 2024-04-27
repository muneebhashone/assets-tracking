import { Icons } from "@/components/icons";
import { Shipment, User, Vessel } from "@prisma/client";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
}
export enum Status {
  false = "false",
  true = "true",
}
export interface IUserMessage {
  id: number;
  email: string;
  password: string;
  name: string | null;
  role: ROLE;
  status: Status;
  accessToken?: string;
}

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  status: string;
}

export interface PaginatedUsers {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  users: IUser[];
}

export interface IRegisterUser {
  email: string;
  name: string;
  password: string;
}

export interface IInsertCoins {
  credits: number;
}
export interface IShipmentData {
  containerID: string;
  containerType: string;
}
export interface IResponse {
  message: string
  status: string
}
export interface ICreateShipment {
  // carrier: string;
  // reference: string;
  // shipment: string;
  // status: string;
  // arivalTime: string;
  tracking_number: string
  carrier: string
}
interface Location {
  id: number;
  name: string;
  state: string;
  country: string;
  country_code: string;
  locode: string;
  lat: number;
  lng: number;
  timezone: string;
}

interface Facility {
  id: number;
  name: string;
  country_code: string;
  locode: string;
  bic_code: string | null;
  smdg_code: string;
  lat: number;
  lng: number;
}

interface Event {
  order_id: number;
  location: number;
  facility: number | null;
  description: string;
  event_type: string;
  event_code: string;
  status: string;
  date: string;
  actual: boolean;
  is_additional_event: boolean;
  type: string;
  transport_type: string;
  vessel: number | null;
  voyage: string | null;
}

interface ApiVessel {
  id: number;
  name: string;
  imo: number;
  call_sign: string;
  mmsi: number;
  flag: string;
}

interface Container {
  number: string;
  iso_code: string;
  status: string;
  events: Event[];
}

interface RoutePath {
  path: [number, number][];
  type: string;
}

interface RouteData {
  route: RoutePath[];
  pin: [number, number];
}

interface Metadata {
  type: string;
  number: string;
  sealine: string;
  sealine_name: string;
  status: string;
  updated_at: string;
  api_calls: {
    total: number | null;
    used: number | null;
    remaining: number | null;
  };
  unique_shipments: {
    total: number;
    used: number;
    remaining: number;
  };
}

interface ShippingData {
  metadata: Metadata;
  locations: Location[];
  facilities: Facility[];
  route: {
    prepol: {
      location: number;
      date: string;
      actual: boolean;
    };
    pol: {
      location: number;
      date: string;
      actual: boolean;
    };
    pod: {
      location: number;
      date: string;
      actual: boolean;
      predictive_eta: string | null;
    };
    postpod: {
      location: number | null;
      date: string | null;
      actual: boolean | null;
    };
  };
  vessels: ApiVessel[];
  containers: Container[];
  route_data: RouteData;
}

export interface ApiResponse {
  status: "error" | "success";
  message: string;
  data: ShippingData;
}


export interface ShipmentProps {
  shipData: Shipment[]
}


export interface ShipmentData extends Shipment {
  vessels: Vessel[]
  user: User
}
export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;


