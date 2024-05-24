// auth.ts
import { PERMISSIONS } from "@prisma/client";
import { IUserMessage, ROLE, Status } from "../types";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    /** The user's postal address. */
    role: ROLE;
  }
  interface Session {
    user: {
      role: ROLE;
      status: Status;
      id: string;
      companyId: number;
      permissions: PERMISSIONS[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: ROLE;
    status: Status;
    id: string;
    companyId: number;
    permissions: PERMISSIONS[];
  }
}
