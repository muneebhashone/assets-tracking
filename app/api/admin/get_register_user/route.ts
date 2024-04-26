import { auth } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { verifyJwt } from "@/lib/jwt";
import { ROLE, Status } from "@prisma/client";
import { NextResponse } from "next/server";

interface VerifyUser {
  email: string;
  role: string;
  iat: number;
  exp: number;
}
export async function GET(request: Request) {
  try {
    const session = await auth();
    //@ts-expect-error
    const { role, status } = session?.user;
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const page = searchParams.get("page") || 1;
    const pageSize = searchParams.get("pageSize") || 3;
    const offset = (Number(page) - 1) * Number(pageSize);

    if (role === ROLE.USER) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const userExist = await db.user.findMany({
      where: {
        AND: [{ role: ROLE.USER }, { status: Status.false }],
      },
      distinct: "id",
      skip: offset,
      take: Number(pageSize),
    });
    const users = await db.user.count({
      where: {
        AND: [{ role: ROLE.USER }, { status: Status.false }],
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
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
