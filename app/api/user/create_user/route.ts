import { createUser } from "@/actions/usersActions";
import { db } from "@/lib/db";
import { createUserFormSchema } from "@/lib/form-schema";
import { checkUserExist, checkUserExist2 } from "@/utils";
import { NextResponse } from "next/server";
import * as zod from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = createUserFormSchema.parse(body);
    const { message, status } = await createUser(payload);
    return NextResponse.json({ message }, { status });
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
