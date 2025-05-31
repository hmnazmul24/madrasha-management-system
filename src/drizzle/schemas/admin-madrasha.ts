import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { students } from "./students";
import { teachers } from "./teacher";
import { donations } from "./donation";
import { spendings } from "./spending";

export const madrasha = pgTable("madrasha", {
  id,
  institutionName: text("instititution_name").notNull().unique(),
  ownerName: text("owner_name").notNull(),
  contactNumber: text("contact_number").notNull(),
  address: text("address").notNull(),
  oneTimePaid: integer("one_time_paid").notNull(),
  userName: text("username").notNull(),
  password: text("password").notNull(),
  disabled: boolean("disabled").notNull().default(false),
  createdAt,
  updatedAt,
});

export const madrashaRelations = relations(madrasha, ({ many }) => ({
  students: many(students),
  teachers: many(teachers),
  donations: many(donations),
  spendings: many(spendings),
}));
