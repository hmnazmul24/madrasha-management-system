"use server";

import { db } from "@/drizzle/db";
import { handleServerError } from "@/lib/handle-server-error";

import { donations } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { donationSchema } from "../schema/donation.schema";
import { DonationValueType } from "../types";
import { auth } from "@/modules/marketing/server/user.action";

export const createDonation = async ({
  donationInfo,
}: {
  donationInfo: DonationValueType;
}) => {
  try {
    const { success, data } = donationSchema.safeParse(donationInfo);
    if (!success) {
      return { message: "Invalid data !" };
    }
    const { id: madrashaId } = await auth();
    //insert data

    await db.insert(donations).values({
      madrashaId,
      donationDetails: data.donationDetails,
      donationType: data.donationType,
      donorName: data.donorName,
      isMoney: data.amount ? "money" : "other",
      amount: data.amount ? Number(data.amount) : 0,
      recievedBookName: data.recievedBookName,
      pageNo: data.pageNo ? Number(data.pageNo) : null,
    });

    return { message: "Donation Added " };
  } catch (error) {
    console.log(error);

    return handleServerError(error);
  }
};

export async function getDonationsPaginated(
  limit: number = 10,
  offset: number = 0
) {
  const { id: madrashaId } = await auth();
  return await db
    .select()
    .from(donations)
    .where(eq(donations.madrashaId, madrashaId))
    .orderBy(desc(donations.createdAt))
    .limit(limit)
    .offset(offset);
}

// Delete Donation
export async function deleteDonation(id: string) {
  await db.delete(donations).where(eq(donations.id, id));
}
export async function editDonation({
  id,
  info,
}: {
  info: DonationValueType;
  id: string;
}) {
  try {
    await db
      .update(donations)
      .set({
        amount: info.amount ? Number(info.amount) : 0,
        donationDetails: info.donationDetails,
        donationType: info.donationType,
        donorName: info.donorName,
        isMoney: info.isMoney,
        pageNo: info.pageNo ? Number(info.pageNo) : 0,
        recievedBookName: info.recievedBookName,
      })
      .where(eq(donations.id, id));

    return { message: "Donation Updated" };
  } catch (error) {
    return handleServerError(error);
  }
}
