import { Icons } from "@/components/icons";
import { PERMISSIONS, Shipment, User, Vessel } from "@prisma/client";
import { SEARATES_CODES } from "./messgaes";
import { createCompanySchema, createUserFormSchema } from "@/lib/form-schema";
import { infer as zInfer } from "zod";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  permissions?: string[];
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

// export const ROLE = {
//   ADMIN: "ADMIN",
//   USER: "USER",
//   SUPER_ADMIN: "SUPER_ADMIN",
// };
// export enum Status {
//   false = "false",
//   true = "true",
// }
// export interface IUserMessage {
//   id: number;
//   email: string;
//   password: string;
//   name: string | null;
//   role: ROLE;
//   status: Status;
//   accessToken?: string;
// }

// export interface IUser {
//   id: number;
//   email: string;
//   password: string;
//   name: string;
//   role: string;
//   status: string;
// }

// export interface PaginatedUsers {
//   totalUsers: number;
//   totalPages: number;
//   currentPage: number;
//   perPage: number;
//   users: IUser[];
// }

export interface IInsertCoins {
  credits: number;
}
export interface IShipmentData {
  containerID: string;
  containerType: string;
}
export interface IResponse {
  message: string;
  status: string;
}
export interface ICreateShipment {
  // carrier: string;
  // reference: string;
  // shipment: string;
  // status: string;
  // arivalTime: string;
  tracking_number: string;
  carrier: string;
  userId: number;
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
  status: "PLANNED" | "IN_TRANSIT" | "DELIVERED" | "UNKNOWN" | string;
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

interface SeaRatesData {
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
export type APIMessage = keyof typeof SEARATES_CODES;

export interface SeaRatesApiResponse {
  status: "error" | "success";
  message: APIMessage;
  data: SeaRatesData;
}

export interface ShipmentProps {
  shipData: ShipmenAdminData[];
}

export interface ShipmenAdminData extends Shipment {
  user?: User;
}
export interface ShipmentData extends Shipment {
  vessels: Vessel[];
  user: User;
}
export interface shipmentDataWithPagination {
  data: ShipmentData[] | null;
  paginatorInfo: {
    skip: number;
    limit: number;
    currentPage: number;
    pages: number;
    hasNextPage: boolean;
    totalRecords: number;
    pageSize: number;
  };
}

export interface SearatesSealineApiResponse {
  status: "success" | "error";
  message: "OK" | "UNEXPECTED_ERROR";
  data: ShippingLine[];
}

interface ShippingLine {
  name: string;
  active: boolean;
  active_types: {
    ct: boolean;
    bl: boolean;
    bk: boolean;
  };
  maintenance: boolean;
  scac_codes: string[];
  prefixes: string[] | null;
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type CreateUserSchemaType = zInfer<typeof createUserFormSchema>;

export type CreateCompanySchemaType = zInfer<typeof createCompanySchema>;
