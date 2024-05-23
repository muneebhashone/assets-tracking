"use server";

import { auth } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { ROLE } from "@/types";
import { checkCompanyById } from "@/utils";

export const insertCoins = async (id: number, credits: number) => {
  try {
    const session = await auth();
    //@ts-ignore
    const { role, status } = session?.user;

    if (role !== ROLE.SUPER_ADMIN) {
      throw new Error("Unauthorized");
    }

    const exist = await checkCompanyById(id);
    if (!exist) {
      return "company does not exist ";
    }

    await db.company.update({
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
    const exist = await checkCompanyById(id);
    if (!exist) {
      return "company not exist ";
    }
    const { credits: companyCredits } = exist;

    if (companyCredits === null) {
      return null;
    }
    const total = companyCredits - 1;
    const updatedCoins = await db.company.update({
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
