import type { ShipmentStatus } from "@/services/shipment.queries";
import type { RoleType } from "@/types/user.types";

export type StatusBadgeRecord = {
  color: string;
  value: "Delivered" | "In Transit" | "Planned" | "Unknown" | "Discharged";
  hexColorCode: string;
};
export const AUTH_KEY = "FrateZoneAccessToken";

export const UserRole = {
  WHITE_LABEL_ADMIN: "White Label Admin",
  WHITE_LABEL_SUB_ADMIN: "White Label Sub Admin",
  CLIENT_SUPER_USER: "Client Super User",
  CLIENT_USER: "Client User",
  SUPER_ADMIN: "Super Admin",
  SUB_ADMIN: "Sub Admin",
};

export const EligibleRolesForCreation: Record<RoleType, RoleType[]> = {
  SUPER_ADMIN: ["WHITE_LABEL_SUB_ADMIN", "CLIENT_USER", "SUB_ADMIN"],
  SUB_ADMIN: ["WHITE_LABEL_SUB_ADMIN", "CLIENT_USER"],
  WHITE_LABEL_ADMIN: ["WHITE_LABEL_SUB_ADMIN"],
  WHITE_LABEL_SUB_ADMIN: [],
  CLIENT_SUPER_USER: ["CLIENT_USER"],
  CLIENT_USER: [],
} as const;

export const EligibleRolesForFilter: Record<RoleType, RoleType[]> = {
  SUPER_ADMIN: [
    "WHITE_LABEL_SUB_ADMIN",
    "WHITE_LABEL_ADMIN",
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
  DISCHARGED: "Discharged",
  DELIVERED: "Delivered",
};

export const TrackWithDisplay = {
  CONTAINER_NUMBER: "Container Number",
  MBL_NUMBER: "Master Bill / Lading Number",
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
  CREATE_COMPANY: "Create Company",
  DELETE_COMPANY: "Delete Company",
  EDIT_COMPANY: "Edit Company",
  VIEW_PERMISSIONS: "View Permissions",
  UPDATE_PERMISSIONS: "Update Permissions",
};

export const StatusBadgeColor: Record<ShipmentStatus, StatusBadgeRecord> = {
  DELIVERED: {
    color: "green-600",
    value: "Delivered",
    hexColorCode: "#16a34a",
  },
  IN_TRANSIT: {
    color: "blue-600",
    value: "In Transit",
    hexColorCode: "#2563eb",
  },
  PLANNED: { color: "gray-500", value: "Planned", hexColorCode: "#6b7280" },
  UNKNOWN: { color: "slate-500", value: "Unknown", hexColorCode: "#64748b" },
  DISCHARGED: {
    color: "yellow-600",
    value: "Discharged",
    hexColorCode: "#ca8a04",
  },
};

export const filterViewOptions = {
  filterByRole: "Role",
  filterByActive: "Is Active",
  trackWith: "Track With",
  status: "Status",
  companyId: "Company",
  childId: "White Label Admin",
  parentId: "Sub Admin",
};
