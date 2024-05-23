import { auth } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { checkUserExist2 } from "@/utils";
import { ROLE, Status } from "@prisma/client";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    const exist = await checkUserExist2(email);
    if (!exist) {
      return NextResponse.json({ message: "user not exist" }, { status: 404 });
    }
    const { status, id } = exist;

    await db.user.update({
      where: { id: id },
      data: { status: Status.true, role: ROLE.ADMIN }, // Review: Check if this is for ADMIN or SUPER_ADMIN. Role unclear
    });
    return NextResponse.json({ message: "status updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 404 },
    );
  }
}
