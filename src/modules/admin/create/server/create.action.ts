"use server";

import { handleServerError } from "@/lib/handle-server-error";

import { genUsernameAndPass } from "../helper";
import { madrashaSchema } from "../schema/create.schema";
import { MadrashSchemaType } from "../types/types";
import { db } from "@/drizzle/db";
import { madrasha } from "@/drizzle/schema";

export const createMadrasha = async ({
  madrashaInfo,
}: {
  madrashaInfo: MadrashSchemaType;
}) => {
  try {
    const { success, data } = madrashaSchema.safeParse(madrashaInfo);
    if (!success) {
      return { message: "Invalid data !" };
    }
    const { password, username: userName } = await genUsernameAndPass();
    const createInfo = {
      ...data,
      userName,
      password,
      oneTimePaid: Number(data.oneTimePaid),
    };
    console.log(createInfo);

    //insert data
    await db.insert(madrasha).values(createInfo);
    return { message: "Madrasha Added " };
  } catch (error) {
    return handleServerError(error);
  }
};
