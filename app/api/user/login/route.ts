import { IUserMessage } from "@/types";
import { checkUserExist } from "@/utils";
import argon2 from "argon2";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const exist = await checkUserExist(email);
    if (!exist) {
      return NextResponse.json({ message: "user not exist" }, { status: 404 });
    }
    const { password: hashPassword } = exist as IUserMessage;
    const validate = await argon2.verify(hashPassword, password);
    if (!validate) {
      return NextResponse.json({ message: "wrong password" }, { status: 404 });
    }
    const { password: userPass, ...rest } = exist as IUserMessage;
    return NextResponse.json({ message: rest }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 404 },
    );
  }
}
