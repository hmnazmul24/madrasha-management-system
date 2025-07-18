import { z } from "zod";
import {
  AddStudentSchema,
  UpdateStudentSchema,
} from "../schema/student.schema";
import {
  ALL_FILTER_TAG,
  GENDER_ARRAY,
  RESULTS_ARR,
  SESSION_RANGES,
  STUDENT_COURSE_ARRAY,
} from "../constants";
import { InferSelectModel } from "drizzle-orm";
import { students } from "@/drizzle/schema";
import { studentFeesSchema } from "../schema/fees.schema";
import { SortingState } from "@tanstack/react-table";

export type DBStudentType = InferSelectModel<typeof students>;
export type AddStudentSchemaType = z.infer<typeof AddStudentSchema>;
export type UpdateStudentSchemaType = z.infer<typeof UpdateStudentSchema>;

export type UploadImageType = {
  secure_url: string;
  public_id: string;
};

export type genderEnumType = (typeof GENDER_ARRAY)[number];
export type courseEnumType = (typeof STUDENT_COURSE_ARRAY)[number];
export type StudentCourseEnumType = (typeof STUDENT_COURSE_ARRAY)[number];
export type sessionRangeEnumType = (typeof SESSION_RANGES)[number];

export type StudentListingType = {
  id: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  name: string;
  studentIdNo: string;
  result: string | null;
  sessionLength: string;
  course: StudentCourseEnumType;
  gender: string;
};

export type StudentFeesSchemaType = z.infer<typeof studentFeesSchema>;

export type FeesFormInfType = {
  session: sessionRangeEnumType;
};

export type StudentResultType = (typeof RESULTS_ARR)[number];

export type StudentIdType = {
  name: string;
  id: string;
  imageUrl?: string;
  course: string;
  session: string;
  madrashaName: string | undefined;
};

// filter types

export type AllFilterType = (typeof ALL_FILTER_TAG)[number];
export type StudentTableFilterPropsType = {
  limit: number;
  offset: number;
  search?: string;
  sorting?: SortingState;
  course: StudentCourseEnumType | AllFilterType;
  sessionRange: string | AllFilterType;
  yearRange: string | AllFilterType;
  gender: genderEnumType | AllFilterType;
};
