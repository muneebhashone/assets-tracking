import { Icons } from "@/components/icons";

export const permissionEnums = [
  "VIEW_SHIPMENT",
  "CREATE_SHIPMENT",
  "EDIT_SHIPMENT",
  "DELETE_SHIPMENT",
  "VIEW_USER",
  "CREATE_USER",
  "EDIT_USER",
  "DELETE_USER",
  "VIEW_DASHBOARD",
  "VIEW_COMPANY",
] as const;

export const rolesEnums = [
  "WHITE_LABEL_ADMIN",
  "WHITE_LABEL_SUB_ADMIN",
  "CLIENT_SUPER_USER",
  "CLIENT_USER",
  "SUPER_ADMIN",
  "SUB_ADMIN",
] as const;
export const statusEnums = ["REJECTED", "APPROVED", "REQUESTED"] as const;

export type RoleType = (typeof rolesEnums)[number];
export type StatusType = (typeof statusEnums)[number];
export type PermissionsType = (typeof permissionEnums)[number];

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
export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
