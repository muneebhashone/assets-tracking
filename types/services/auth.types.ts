import { UserRole } from "@/utils/constants";
import { PermissionsType, StatusType } from "../user.types";

export type LoginInputType = {
  email: string;
  password: string;
};

export type RegisterUserInputType = {
  name: string;
  email: string;
  password: string;
  companyId?: string | null;
};
export interface SetPasswordInputType {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ResetPasswordInputType {
  password: string;
  confirmPassword: string;
  token: string;
}
export interface ForgetPasswordInputType {
  email: string;
}

export interface ChangePasswordInputType {
  newPassword: string;
  currentPassword: string;
  confirmPassword: string;
}
export type RegisterCompanyInputType = {
  name: string;
  email: string;
  password: string;
  companyName: string;
  country: string;
  city: string;
};

export type LoginResponseType = {
  token: string;
};

export interface CurrentUserResponseType {
  user: User;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNo?: string;
  avatar?: string;
  role: keyof typeof UserRole;
  isActive: boolean;
  password: string;
  status: StatusType;
  credits: number;
  companyId: number;
  clientId?: number;
  permissions: PermissionsType[];
  setPasswordToken?: string;
  passwordResetToken?: string;
  updatedAt?: string;
}
