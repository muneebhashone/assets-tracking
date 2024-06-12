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

export interface IUser {
  id: number;
  email: string;
  name: string;
  role: RoleType;
  isActive: boolean;
  password?: string;
  status: StatusType;
  companyId: number | null;
  clientId: number | null;
  permissions: PermissionsType[];
  credits: number;
}
