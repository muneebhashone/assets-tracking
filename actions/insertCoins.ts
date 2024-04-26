"use server";

import { auth } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { ROLE } from "@/types";
import { checkUserById, checkUserExist2 } from "@/utils";

export const insertCoins = async (id: number, credits: number) => {
  try {
    const session = await auth();
    //@ts-ignore
    const { role, status } = session?.user;

    if (role === ROLE.USER) {
      throw new Error("Unauthorized");
    }
    const exist = await checkUserById(id);
    if (!exist) {
      return "user not exist ";
    }




    await db.user.update({
      where: { id },
      data: {
        credits: credits,
      },
    });
    return "updated sucessfull";
  } catch (error) {
    //@ts-expect-error
    return error.message;
  }
};
export const removeCoins = async (id: number) => {
  try {
    const exist = await checkUserById(id);
    if (!exist) {
      return "user not exist ";
    }
    const { credits: userCredits } = exist;

    if (userCredits === null) {
      return null;
    }
    const total = userCredits - 1;
    const updatedCoins = await db.user.update({
      where: { id },
      data: {
        credits: total,
      },
    });

    return updatedCoins;
  } catch (error) {
    //@ts-expect-error
    return error.message;
  }
};
