"use server";

import { db } from "@/drizzle/db";
import { madrasha } from "@/drizzle/schema";
import { EditMadrashaSchemaType } from "../types";
import { editMadrashaSchema } from "../schema/all.schema";
import { handleServerError } from "@/lib/handle-server-error";

export const getAllMadrasha = async () => {
  return db.select().from(madrasha);
};

export const eidtMadrasha = async ({
  madrashaInfo,
}: {
  madrashaInfo: EditMadrashaSchemaType;
}) => {
  try {
    const { success, data } = editMadrashaSchema.safeParse(madrashaInfo);
    if (!success) {
      return { message: "Invalid data !" };
    }
    const { address, contactNumber, institutionName, oneTimePaid, ownerName } =
      data;

    await db.update(madrasha).set({
      address,
      contactNumber,
      institutionName,
      oneTimePaid: Number(oneTimePaid),
      ownerName,
    });

    return { message: "Madrasha  Info Updated " };
  } catch (error) {
    return handleServerError(error);
  }
};
