import { db } from "@/lib/db";
import { signJwtAccessToken } from "@/lib/jwt";
import { IUserMessage } from "@/types";
import { ROLE, Status } from "@prisma/client";
import argon2 from "argon2";

const checkUserExist = async (email: string) => {
  //   "use server";
  let exist = await db.user.findFirst({
    where: {
      AND: [{ email: email }, { status: Status.true }],
    },
  });
  if (!exist) return null;
  const data = {
    email: exist?.email,
    role: exist?.role,
  };
  const token = signJwtAccessToken(data);

  return { exist, token };
};
const checkUserExist2 = async (email: string) => {
  let exist = await db.user.findFirst({
    where: {
      email,
    },
  });
  if (!exist) return null;

  return exist;
};
const checkUserById = async (id: number) => {
  let exist = await db.user.findFirst({
    where: {
      id,
    },
  });
  if (!exist) return null;

  return exist;
};
const checkUserCredits = async (id: number) => {
  let exist = await db.user.findFirst({
    where: {
      id,
    },
  });
  if (!exist) return null;
  const { credits } = exist;
  return credits;
};
const checkPassword = async (
  hashPassword: string,
  password: string,
): Promise<boolean> => {
  const validate = await argon2.verify(hashPassword, password);
  return validate;
};

const getPaginator = (
  limitParam: number,
  pageParam: number,
  totalRecords: number,
): {
  skip: number;
  limit: number;
  currentPage: number;
  pages: number;
  hasNextPage: boolean;
  totalRecords: number;
  pageSize: number;
} => {
  let skip = pageParam;
  let limit = limitParam;

  if (pageParam <= 1) {
    skip = 0;
  } else {
    skip = limit * (pageParam - 1);
  }

  const currentPage = Math.max(1, pageParam as number);

  const pages = Math.ceil(totalRecords / Number(limit));

  const hasNextPage = pages > currentPage;

  return {
    skip,
    limit,
    currentPage,
    pages,
    hasNextPage,
    totalRecords,
    pageSize: limit,
  };
};

export {
  checkUserExist,
  checkPassword,
  checkUserExist2,
  checkUserById,
  checkUserCredits,
  getPaginator,
};
