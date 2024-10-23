import { UserRole } from "@/utils/constants";
import { PermissionsType, RoleType, StatusType } from "../user.types";
import { Company } from "@/services/companies.queries";

export type LoginInputType = {
  email: string;
  password: string;
  rememberMe?: boolean;
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
  user: UserWithWallet;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNo?: string;
  avatar?: string;
  role: RoleType;
  isActive: boolean;
  password: string;
  status: StatusType;
  companyId: number | null;
  company: Company | null;
  clientId: number | null;
  client: User | null;
  permissions: PermissionsType[];
  setPasswordToken?: string;
  passwordResetToken?: string;
  updatedAt?: string;
}
export interface UserWithWallet extends User {
  wallet: WalletType;
}
export type WalletType = {
  id: number;
  createdAt: string | null;
  updatedAt: string | null;
  credits: number | null;
};
