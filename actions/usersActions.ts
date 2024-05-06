"use server";

import { auth } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { ROLE, Status } from "@/types";
import { userState } from "@/types/enums";
import { checkUserExist2 } from "@/utils";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const getRegisteredUsers = async ({
  pageParam,
  pageSizeParam,
}: {
  pageParam: number;
  pageSizeParam: number;
}) => {
  try {
    const session = await auth();
    //@ts-ignore
    const { role, status } = session?.user;

    const page = pageParam || 1;
    const pageSize = pageSizeParam || 3;
    const offset = (Number(page) - 1) * Number(pageSize);

    if (role === ROLE.USER) {
      throw new Error("Unauthorized");
    }

    const userExist = await db.user.findMany({
      where: {
        AND: [
          { role: { equals: ROLE.USER } },
          { status: { equals: Status.false } },
          { deleted: { equals: false } },
        ],
      } as Prisma.UserWhereInput,
      distinct: "id",
      skip: offset,
      take: Number(pageSize),
    });

    const users = await db.user.count({
      where: {
        AND: [
          { role: { equals: ROLE.USER } },
          { status: { equals: Status.false } },
          { deleted: { equals: false } },
        ],
      } as Prisma.UserWhereInput,
    });
    const totalPages = Math.ceil(users / Number(pageSize));

    const response = {
      totalUsers: users,
      totalPages: totalPages,
      currentPage: Number(page),
      perPage: Number(pageSize),
      users: userExist, // Array of user objects with their scans
    };
    return response;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    throw new Error(error.message);
  }
};
export const getRejectedUsers = async ({
  pageParam,
  pageSizeParam,
}: {
  pageParam: number;
  pageSizeParam: number;
}) => {
  try {
    const session = await auth();
    //@ts-ignore
    const { role, status } = session?.user;

    const page = pageParam || 1;
    const pageSize = pageSizeParam || 3;
    const offset = (Number(page) - 1) * Number(pageSize);

    if (role === ROLE.USER) {
      throw new Error("Unauthorized");
    }

    const userExist = await db.user.findMany({
      where: {
        AND: [{ role: { equals: ROLE.USER } }, { deleted: { equals: true } }],
      } as Prisma.UserWhereInput,
      distinct: "id",
      skip: offset,
      take: Number(pageSize),
    });

    const users = await db.user.count({
      where: {
        AND: [{ role: { equals: ROLE.USER } }, { deleted: { equals: true } }],
      } as Prisma.UserWhereInput,
    });
    const totalPages = Math.ceil(users / Number(pageSize));

    const response = {
      totalUsers: users,
      totalPages: totalPages,
      currentPage: Number(page),
      perPage: Number(pageSize),
      users: userExist, // Array of user objects with their scans
    };
    return response;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    throw new Error(error.message);
  }
};

export const getActiveUser = async ({
  pageParam,
  pageSizeParam,
}: {
  pageParam: number;
  pageSizeParam: number;
}) => {
  try {
    const session = await auth();
    //@ts-ignore
    const { role } = session?.user;

    const page = pageParam || 1;
    const pageSize = pageSizeParam || 3;
    const offset = (Number(page) - 1) * Number(pageSize);

    if (role === ROLE.USER) {
      return "unauthorized";
    }

    const userExist = await db.user.findMany({
      where: {
        AND: [
          { role: { equals: ROLE.USER } },
          { status: { equals: Status.true } },
          { deleted: { equals: false } },
        ],
      } as Prisma.UserWhereInput,
      distinct: "id",
      skip: offset,
      take: Number(pageSize),
    });
    const users = await db.user.count({
      where: {
        AND: [
          { role: { equals: ROLE.USER } },
          { status: { equals: Status.true } },
          { deleted: { equals: false } },
        ],
      },
    });
    const totalPages = Math.ceil(users / Number(pageSize));

    const response = {
      totalUsers: users,
      totalPages: totalPages,
      currentPage: Number(page),
      perPage: Number(pageSize),
      users: userExist, // Array of user objects with their scans
    };
    return response;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    return "internal server error";
  }
};

export const rejectUser = async (email: string) => {
  try {
    const session = await auth();
    //@ts-ignore
    const { role } = session?.user;

    if (role === ROLE.USER) {
      return "unauthorized";
    }
    await db.user.delete({ where: { email: email } });
    return "user deleted ";
  } catch (error) {
    //@ts-ignore
    return "internal server error";
  }
};

export const softDeleteUser = async (email: string) => {
  try {
    const session = await auth();
    //@ts-ignore
    const { role } = session?.user;
    if (role === ROLE.USER) {
      return "unauthorized";
    }
    const exist = await checkUserExist2(email);
    if (!exist) {
      return "user not exist";
    }
    await db.user.update({
      data: { deleted: true },
      where: {
        email: email,
      },
    });
  } catch (error) {
    return "internal server error";
  }
};
export const undoDeleteUser = async (email: string) => {
  try {
    const session = await auth();
    //@ts-ignore
    const { role } = session?.user;
    if (role === ROLE.USER) {
      return "unauthorized";
    }
    const exist = await checkUserExist2(email);
    if (!exist) {
      return "user not exist";
    }
    await db.user.update({
      data: { deleted: false },
      where: {
        email: email,
      },
    });
  } catch (error) {
    return "internal server error";
  }
};

export const editProfile = async (name: string, email: string) => {
  try {
    const exist = await checkUserExist2(email);
    if (!exist) {
      return null;
    }
    await db.user.update({
      data: { name },
      where: { id: exist?.id },
    });
  } catch (error) {
    return error;
  }
};
export const userData = async (id: string) => {
  Number(id);
  try {
    const user = await db.user.findFirst({ where: { id: Number(id) } });
    return user;
  } catch (error) {
    return error;
  }
};

export const getUserCount = async (status?: userState) => {
  let filter: Prisma.UserCountArgs = {
    where: {
      AND: [{ role: { not: ROLE.ADMIN } }],
    },
  };
  if (status) {
    switch (status) {
      case userState.ACCEPTED:
        (filter?.["where"]?.["AND"] as Prisma.UserWhereInput[])?.push({
          status: Status.true,
        });
        (filter?.["where"]?.["AND"] as Prisma.UserWhereInput[])?.push({
          deleted: false,
        });
        break;
      case userState.REJECTED:
        (filter?.["where"]?.["AND"] as Prisma.UserWhereInput[])?.push({
          deleted: true,
        });
        break;
      case userState.PENDING:
        (filter?.["where"]?.["AND"] as Prisma.UserWhereInput[])?.push({
          status: Status.false,
        });
        break;
    }
  }

  const usersCount = await db.user.count(filter);
  return { usersCount };
};
