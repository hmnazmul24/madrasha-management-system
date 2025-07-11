export const locale = ["en", "bn"] as const;
export type Locale = (typeof locale)[number];
export const defaultLocale: Locale = "en";
