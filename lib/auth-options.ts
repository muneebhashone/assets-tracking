import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { checkPassword, checkUserExist, checkUserExist2 } from "@/utils";
import { IUserMessage, ROLE, Status } from "@/types";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        name: token?.name,
        role: token.role,
        status: token.status,
        credits: token.credits,
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          ...user,
        };
      }
      return token;
    },
  },
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "******",
        },
      },
      //@ts-ignore
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const data = await checkUserExist2(credentials.email);
        if (!data?.email) {
          throw new Error("user not exist");
        }
        if (data.status === Status.false) {
          if (data.deleted === true) {
            throw new Error("request rejected");
          }
          throw new Error("request pending");
        }
        const { password: hashPassword } = data;
        const check = await checkPassword(hashPassword, credentials.password);
        if (!check) {
          throw new Error("Incorrect password");
        }

        return {
          ...data,
          // accessToken: data.token,
        };
      },
    }),
  ],
};

export const auth = async () => {
  return getServerSession(authOptions);
};
