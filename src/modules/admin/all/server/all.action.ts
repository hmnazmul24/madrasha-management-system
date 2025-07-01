"use server";

import { db } from "@/drizzle/db";
import { madrasha } from "@/drizzle/schema";
import { EditMadrashaSchemaType } from "../types";
import { editMadrashaSchema } from "../schema/all.schema";
import { handleServerError } from "@/lib/handle-server-error";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "@/data/env/server";
import { jwtVerify } from "jose";
import { PayloadType } from "@/types";

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

export const VisitMadrashaLogin = async ({
  madrashaId,
  madrashaName,
}: {
  madrashaId: string;
  madrashaName: string;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return new Error("token does'nt exist");
  }
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  const { role, userName } = payload as PayloadType;

  if (role === "ADMIN") {
    // Generate JWT token
    const signToken = jwt.sign(
      {
        userName: userName,
        role: "ADMIN",
        visitingMadrashaId: madrashaId,
        visitingMadrashaName: madrashaName,
      },
      env.JWT_SECRET,
      {
        expiresIn: "3650d", // 10 years
      }
    );

    const TEN_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 10;
    // 10 years in seconds
    cookieStore.set({
      name: "auth_token",
      value: signToken,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: TEN_YEARS_IN_SECONDS, // Cookie lasts for 10 years
    });
  }
};
