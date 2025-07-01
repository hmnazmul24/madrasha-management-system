import { DONATION_ARR } from "@/modules/dashboard/donations/constants";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { madrasha } from "./admin-madrasha";

export const donationEnum = pgEnum("donation_type", DONATION_ARR);

export const donations = pgTable("donations", {
  id,
  madrashaId: uuid("madrasha_id")
    .notNull()
    .references(() => madrasha.id, { onDelete: "cascade" }),
  donationType: donationEnum("donation_type").notNull(),
  isMoney: text("is_money").notNull(), // "money" | "other"
  amount: integer("amount"), // Nullable (only for money donations)
  donationDetails: text("donation_details").notNull(),
  donorName: varchar("donor_name", { length: 255 }).notNull(),
  recievedBookName: text("received_book_name"),
  pageNo: integer("page_no"),
  createdAt,
  updatedAt,
});

export const donationRelations = relations(donations, ({ one }) => ({
  madrasha: one(madrasha, {
    fields: [donations.madrashaId],
    references: [madrasha.id],
  }),
}));
