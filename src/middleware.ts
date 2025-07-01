import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { env } from "./data/env/server";
import { PayloadType } from "./types";
import {
  ADMIN_START,
  COOKIE_NAME,
  HOME_ROUTE,
  MADRASHA_ROUTE,
  MADRASHA_START,
} from "./routes";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  // for redirections
  const pathname = req.nextUrl.pathname;
  const homePath = pathname === HOME_ROUTE;
  const madrashaPath = pathname.startsWith(MADRASHA_ROUTE);
  // const adminPath = pathname.startsWith(ADMIN_ROUTE);

  if (!token && !homePath) {
    return NextResponse.redirect(new URL(HOME_ROUTE, req.url));
  }
  if (token && homePath) {
    return NextResponse.next();
  } else if (token && !homePath) {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const { role, userName } = payload as PayloadType;

    // checking unauthority
    //admin
    if (userName.startsWith(ADMIN_START)) {
      if (userName !== env.ADMIN_USERNAME) {
        const cookie = await cookies();
        cookie.delete(COOKIE_NAME);
        return NextResponse.redirect(new URL(HOME_ROUTE, req.url));
      } else {
        return NextResponse.next();
      }
    }
    //branch
    if (!userName.startsWith(MADRASHA_START)) {
      const cookie = await cookies();
      cookie.delete(COOKIE_NAME);
      return NextResponse.redirect(new URL(HOME_ROUTE, req.url));
    }
    if (role === "ADMIN") {
      return NextResponse.next();
    }
    // if (role === "ADMIN" && !adminPath) {
    //   return NextResponse.redirect(new URL(HOME_ROUTE, req.url));
    // }
    if (role === "MADRASHA" && !madrashaPath) {
      return NextResponse.redirect(new URL(HOME_ROUTE, req.url));
    }
  }
  // ✅ This was missing before!
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
