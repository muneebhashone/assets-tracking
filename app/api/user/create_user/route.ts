import { db } from "@/lib/db";
import { checkUserExist, checkUserExist2 } from "@/utils";
import { NextResponse } from "next/server";
import argon2 from "argon2";
import * as zod from "zod";

const createUserSchem = zod.object({
  email: zod
    .string({ required_error: "email is required" })
    .min(1, { message: " enter your email" })
    .email({ message: "enter a valid email" }),
  name: zod.string().min(3, { message: "atleast 3" }),

  password: zod
    .string({ required_error: "password is required" })
    .min(8, { message: "atleast 8" })
    .max(12, { message: "atmost 12" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = createUserSchem.parse(body);
    const exist = await checkUserExist(email);
    if (exist) {
      return NextResponse.json(
        { message: "user already  exist" },
        {
          status: 404,
        },
      );
    }
    const hash = await argon2.hash(password);
    await db.user.create({
      data: { email, name, password: hash },
    });

    return NextResponse.json({ message: "user created" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { email } = await request.json();

    const exist = await checkUserExist2(email);

    if (!exist) {
      return NextResponse.json(
        { message: "User not found" },
        {
          status: 404,
        },
      );
    }
    await db.user.delete({
      where: { email },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      {
        status: 500,
      },
    );
  }
}
