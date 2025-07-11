export type PayloadType = {
  userName: string;
  role: "MADRASHA" | "ADMIN";
  id: string;
  madrashaName: string;
  visitingMadrashaId?: string;
  visitingMadrashaName?: string;
  exp: number;
};

import { Paths } from "@/lib/flatten-keys";
import en from "../../messages/en.json";

export type MessageKeys = Paths<typeof en>;
