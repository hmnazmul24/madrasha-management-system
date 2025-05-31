"use server";

import { db } from "@/drizzle/db";
import { handleServerError } from "@/lib/handle-server-error";

import { spendings } from "@/drizzle/schemas/spending";
import { desc, eq } from "drizzle-orm";
import { spendingSchema } from "../schema/spending.schema";
import { SpendingSchemaType } from "../types/type";
import { auth } from "@/modules/marketing/server/user.action";

export const createSpending = async ({
  spendingInfo,
}: {
  spendingInfo: SpendingSchemaType;
}) => {
  try {
    const { success, data } = spendingSchema.safeParse(spendingInfo);
    if (!success) {
      return { message: "Invalid data !" };
    }
    const { id: madrashaId } = await auth();

    //insert data
    await db.insert(spendings).values({
      madrashaId,
      amount: Number(data.amount),
      month: data.month,
      spendingDetails: data.spendingDetails,
      spendingField: data.spendingField,
      year: data.year,
    });
    return { message: "Spendings Added " };
  } catch (error) {
    return handleServerError(error);
  }
};

export async function getSpendingsPaginated(
  limit: number = 10,
  offset: number = 0
) {
  const { id: madrashaId } = await auth();
  return await db
    .select()
    .from(spendings)
    .where(eq(spendings.madrashaId, madrashaId))
    .orderBy(desc(spendings.createdAt))
    .limit(limit)
    .offset(offset);
}

// Delete Donation
export async function deleteSpending(id: string) {
  await db.delete(spendings).where(eq(spendings.id, id));
}

export async function editSpendings({
  id,
  info,
}: {
  info: SpendingSchemaType;
  id: string;
}) {
  try {
    await db
      .update(spendings)
      .set({
        amount: Number(info.amount),
        month: info.month,
        spendingDetails: info.spendingDetails,
        spendingField: info.spendingField,
        year: info.year,
      })
      .where(eq(spendings.id, id));

    return { message: "Spending Updated" };
  } catch (error) {
    return handleServerError(error);
  }
}
