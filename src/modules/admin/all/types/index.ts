import { madrasha } from "@/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { editMadrashaSchema } from "../schema/all.schema";

export type EditMadrashaSchemaType = z.infer<typeof editMadrashaSchema>;
export type DBMadrashaType = InferSelectModel<typeof madrasha>;
