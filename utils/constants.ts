import { RoleType } from "@/types/user.types";

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
    "WHITE_LABEL_ADMIN",
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
