"use server";

import { defaultLocale, Locale } from "@/i18n/config";
import { cookies } from "next/headers";

const NEXT_LOCALE = "NEXT_LOCALE";

export async function getUserLocale() {
  return (await cookies()).get(NEXT_LOCALE)?.value || defaultLocale;
}
export async function setUserLocale(locale: Locale) {
  (await cookies()).set(NEXT_LOCALE, locale);
}
