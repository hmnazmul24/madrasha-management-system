import { db } from "@/drizzle/db";
import { madrasha } from "@/drizzle/schemas/admin-madrasha";
import { eq } from "drizzle-orm";

export const genUsernameAndPass = async () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const usernameLength = 6;
  const passwordLength = 6;

  let username = "";
  for (let i = 0; i < usernameLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    username += chars[randomIndex];
  }

  const [isExist] = await db
    .select()
    .from(madrasha)
    .where(eq(madrasha.userName, username));
  if (isExist) {
    genUsernameAndPass();
  }

  // Generate a random 8-digit password
  const password = Array.from({ length: passwordLength }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  return { username, password };
};
