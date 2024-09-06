import { ShipmentStatus } from "@/services/shipment.queries";
import { RoleType } from "@/types/user.types";

export type StatusBadgeRecord = {
  color: string;
  value: "Delivered" | "In Transit" | "Planned" | "Unknown";
};
export const AUTH_KEY = "accessToken";

export const UserRole = {
  WHITE_LABEL_ADMIN: "White Label Admin",
  WHITE_LABEL_SUB_ADMIN: "White Label Sub Admin",
  CLIENT_SUPER_USER: "Client Super User",
  CLIENT_USER: "Client User",
  SUPER_ADMIN: "Super Admin",
  SUB_ADMIN: "Sub Admin",
};

export const EligibleRolesForCreation: Record<RoleType, RoleType[]> = {
  SUPER_ADMIN: [
    "WHITE_LABEL_SUB_ADMIN",
    "CLIENT_SUPER_USER",
    "CLIENT_USER",
    "SUB_ADMIN",
  ],
  SUB_ADMIN: [
    "WHITE_LABEL_ADMIN",
    "WHITE_LABEL_SUB_ADMIN",
    "CLIENT_SUPER_USER",
    "CLIENT_USER",
  ],
  WHITE_LABEL_ADMIN: ["CLIENT_SUPER_USER", "WHITE_LABEL_SUB_ADMIN"],
  WHITE_LABEL_SUB_ADMIN: ["CLIENT_SUPER_USER"],
  CLIENT_SUPER_USER: ["CLIENT_USER"],
  CLIENT_USER: [],
} as const;

export const ShipmentStatusDisplay = {
  IN_TRANSIT: "In Transit",
  PLANNED: "Planned",
  UNKNOWN: "Unknown",
  DELIVERED: "Delivered",
};

export const TrackWithDisplay = {
  CONTAINER_NUMBER: "Container Number",
  MBL_NUMBER: "Master Bill Of Lading Number",
};

export const PermissionsForDisplay = {
  VIEW_SHIPMENT: "View Shipment",
  CREATE_SHIPMENT: "Create Shipment",
  EDIT_SHIPMENT: "Edit Shipment",
  DELETE_SHIPMENT: "Delete Shipment",
  VIEW_USER: "View User",
  CREATE_USER: "Create User",
  EDIT_USER: "Edit User",
  DELETE_USER: "Delete User",
  VIEW_DASHBOARD: "View Dashboard",
  VIEW_COMPANY: "View Company",
  DELETE_COMPANY: "Delete Company",
  EDIT_COMPANY: "Edit Company",
  ASSIGN_CREDITS: "Assign Credits",
  DEDUCT_CREDITS: "Deduct Credits",
  VIEW_PERMISSIONS: "View Permissions",
  UPDATE_PERMISSIONS: "Update Permissions",
};

export const StatusBadgeColor: Record<ShipmentStatus, StatusBadgeRecord> = {
  DELIVERED: { color: "green-600", value: "Delivered" },
  IN_TRANSIT: { color: "black", value: "In Transit" },
  PLANNED: { color: "blue-500", value: "Planned" },
  UNKNOWN: { color: "gray-500", value: "Unknown" },
};
