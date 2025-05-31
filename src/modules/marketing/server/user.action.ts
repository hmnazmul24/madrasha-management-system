"use server";

import { handleServerError } from "@/lib/handle-server-error";
import { LoginFormSchemaType } from "../Login";
import { env } from "@/data/env/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { db } from "@/drizzle/db";
import { madrasha } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { PayloadType } from "@/types";

const TEN_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 10;

export const userLogin = async (loginInfo: LoginFormSchemaType) => {
  try {
    if (
      loginInfo.userName === env.ADMIN_USERNAME &&
      loginInfo.password === env.ADMIN_PASSWORD
    ) {
      const cookieStore = await cookies();
      // Generate JWT token
      const token = jwt.sign(
        { userName: loginInfo.userName, role: "ADMIN" },
        env.JWT_SECRET,
        {
          expiresIn: "3650d", // 10 years
        }
      );
      // 10 years in seconds
      cookieStore.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: TEN_YEARS_IN_SECONDS, // Cookie lasts for 10 years
      });
      return { message: "Login successfull" };
    } else if (
      loginInfo.userName.startsWith(env.MADRASHA_USERNAME_PREFIX) &&
      loginInfo.password.startsWith(env.MADRASHA_PASSWORD_PREFIX)
    ) {
      const [exitedMadrasha] = await db
        .select()
        .from(madrasha)
        .where(
          and(
            eq(
              madrasha.userName,
              loginInfo.userName.substring(env.MADRASHA_USERNAME_PREFIX.length)
            ),
            eq(
              madrasha.password,
              loginInfo.password.substring(env.MADRASHA_PASSWORD_PREFIX.length)
            )
          )
        );

      if (!exitedMadrasha) {
        return { error: "Invalid Credentials" };
      }
      // now madrasha is varified
      const cookieStore = await cookies();
      // Generate JWT token
      const token = jwt.sign(
        {
          userName: loginInfo.userName,
          role: "MADRASHA",
          id: exitedMadrasha.id,
          madrashaName: exitedMadrasha.institutionName,
        },
        env.JWT_SECRET,
        {
          expiresIn: "3650d", // 10 years
        }
      );
      // 10 years in seconds
      cookieStore.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: TEN_YEARS_IN_SECONDS, // Cookie lasts for 10 years
      });

      return { message: "Login successfull" };
    } else {
      return { error: "Invalid Credentials" };
    }
  } catch (error) {
    return handleServerError(error);
  }
};

export const auth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    const session: PayloadType & { authenticated: boolean } = {
      exp: 0,
      id: "",
      madrashaName: "",
      role: "MADRASHA",
      userName: "",
      authenticated: false,
    };
    return session;
  }
  const payload = jwtDecode(token) as PayloadType;
  return { ...payload, authenticated: true };
};

export const userLogout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/");
};
