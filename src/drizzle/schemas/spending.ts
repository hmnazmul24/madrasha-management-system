import {
  ALL_MONTHS,
  SPENDING_FIELDS,
  YEARS_ARR,
} from "@/modules/dashboard/spendings/constants";
import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { madrasha } from "./admin-madrasha";
import { relations } from "drizzle-orm";

export const spendingEnum = pgEnum("spending_field", SPENDING_FIELDS);
export const monthEnum = pgEnum("month", ALL_MONTHS);
export const yearEnum = pgEnum("year", YEARS_ARR); // ✅ Corrected this line

export const spendings = pgTable("spendings", {
  id,
  madrashaId: uuid("madrasha_id")
    .notNull()
    .references(() => madrasha.id, { onDelete: "cascade" }),
  spendingField: spendingEnum("spending_field").notNull(),
  month: monthEnum("month").notNull(),
  year: yearEnum("year").notNull(), // ✅ Fixed incorrect field name
  amount: integer("amount").notNull(),
  spendingDetails: text("spending_details"), // ✅ Fixed field name consistency
  createdAt,
  updatedAt,
});

export const spendingRelations = relations(spendings, ({ one }) => ({
  madrasha: one(madrasha, {
    fields: [spendings.madrashaId],
    references: [madrasha.id],
  }),
}));
