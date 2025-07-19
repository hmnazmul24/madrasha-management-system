"use server";

import { db } from "@/drizzle/db";
import { madrasha } from "@/drizzle/schema";
import { auth } from "@/modules/marketing/server/user.action";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { settingSchema } from "../schemas/settings.schema";

export async function getMadrashaUserName() {
  const { id } = await auth();
  const [result] = await db
    .select({ userName: madrasha.userName })
    .from(madrasha)
    .where(eq(madrasha.id, id));
  return { userName: result.userName };
}
export async function updateMadrashPassword(
  info: z.infer<typeof settingSchema>
) {
  const { id, role } = await auth();
  if (role === "ADMIN") {
    return { errorMessage: "password can't be changeble from admin panel" };
  }
  const { success } = settingSchema.safeParse(info);
  if (!success) return { errorMessage: "not valid" };
  const [result] = await db
    .select({ password: madrasha.password })
    .from(madrasha)
    .where(eq(madrasha.id, id));

  if (result.password !== info.oldPassword.trim()) {
    return { errorMessage: "old password not matched" };
  }
  if (info.newPassword.trim() !== info.newConfirmPassword.trim()) {
    return { errorMessage: "New password and confirm password is not matched" };
  }
  await db
    .update(madrasha)
    .set({ password: info.newPassword })
    .where(eq(madrasha.id, id));
  return { successMessage: "Password updated successfully" };
}
