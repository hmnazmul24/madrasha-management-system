"use client";

import { Button } from "@/components/ui/button";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

import React, { useTransition } from "react";

const buttonTailwind =
  "bg-transparent text-sm hover:text-emerald-600 cursor-pointer hover:bg-transparent text-white";

export default function SwitchLan() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const clickHandler = (locale: Locale) => {
    startTransition(() => {
      setUserLocale(locale);
    });
  };
  return (
    <div>
      <fieldset className="grid grid-cols-2 mt-5 border rounded-md">
        <legend className="px-2 text-gray-500">languages</legend>
        <Button
          disabled={isPending}
          onClick={() => clickHandler("en")}
          className={cn(
            buttonTailwind,
            locale === "en" ? "text-emerald-500" : "text-gray-400"
          )}
        >
          English
        </Button>
        <Button
          disabled={isPending}
          onClick={() => clickHandler("bn")}
          className={cn(
            buttonTailwind,
            locale === "bn" ? "text-emerald-500" : "text-gray-400"
          )}
        >
          Bangla
        </Button>
      </fieldset>
    </div>
  );
}
