import {
  COURSE_ARRAY,
  GENDER_ARRAY,
  PASS_STATUS_ARRAY,
} from "@/modules/dashboard/students/constants";
import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { madrasha } from "./admin-madrasha";

// Enums
export const courseEnum = pgEnum("course", COURSE_ARRAY);

export const genderEnum = pgEnum("gender", GENDER_ARRAY);

export const passStatusEnum = pgEnum("pass_status", PASS_STATUS_ARRAY);

// Student Schema
export const students = pgTable("students", {
  id,
  madrashaId: uuid("madrasha_id")
    .notNull()
    .references(() => madrasha.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  imagePublicId: text("image_public_id"),
  fatherName: text("father_name"),
  motherName: text("mother_name"),
  course: courseEnum("course").notNull().default("Moqtob"),
  dataOfBirth: date("date_of_birth", { mode: "date" }).notNull(),
  gender: genderEnum("gender").notNull(),
  sessionLength: text("session_length")
    .notNull()
    .default("january_2025_december_2025"),
  sessionDurationInYear: integer("session_duration_in_year").default(1),

  address: text("address"),
  physicalCondition: text("physical_condition").default("normal"),
  admissionTimePaid: integer("admission_time_paid").default(0),
  studentIdNO: text("student_id_no").notNull(),
  passStatus: passStatusEnum("pass_status").default("null"),
  result: text("result"),
  createdAt,
  updatedAt,
});

export const studentRelations = relations(students, ({ one, many }) => ({
  madrasha: one(madrasha, {
    fields: [students.madrashaId],
    references: [madrasha.id],
  }),
  feesRecords: many(studentFees),
}));

export const studentFees = pgTable("student_fees", {
  id,
  mealFees: integer("meal_fees").notNull(),
  educationFees: integer("education_fees").notNull(),
  month: text("month").notNull(),
  year: text("year"),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const studentFeesRelations = relations(studentFees, ({ one }) => ({
  student: one(students, {
    fields: [studentFees.studentId],
    references: [students.id],
  }),
}));
