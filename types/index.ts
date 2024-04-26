import { Icons } from "@/components/icons";

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

export interface IInsrtCoins {
  credits: number;
}
export interface IShipmentData {
  containerID: string;
  containerType: string;
}

export interface ICreateShipment {
  carrier: string;
  reference: string;
  shipment: string;
  status: string;
  arivalTime: string;
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
