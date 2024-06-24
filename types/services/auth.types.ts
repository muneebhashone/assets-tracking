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
  role:
    | "WHITE_LABEL_ADMIN"
    | "WHITE_LABEL_SUB_ADMIN"
    | "CLIENT_SUPER_USER"
    | "CLIENT_USER"
    | "SUPER_ADMIN"
    | "SUB_ADMIN";
  isActive: boolean;
  password: string;
  status: string;
  credits: number;
  companyId: number;
  permissions: string[];
}
