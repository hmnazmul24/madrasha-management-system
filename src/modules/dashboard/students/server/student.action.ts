"use server";

import { db } from "@/drizzle/db";
import { students } from "@/drizzle/schemas/students";
import { handleServerError } from "@/lib/handle-server-error";
import { deleteFromCloude, uploadToCloude } from "@/lib/upload-image";
import { auth } from "@/modules/marketing/server/user.action";
import { SortingState } from "@tanstack/react-table";
import { and, asc, count, desc, eq, ilike, SQL } from "drizzle-orm";
import { RESULTS_ARR } from "../constants";
import { generateUniqueStudentId } from "../helper/helper.action";
import { AddStudentSchema } from "../schema/student.schema";
import {
  AddStudentSchemaType,
  DBStudentType,
  StudentCourseEnumType,
} from "../types";

export const createStudent = async ({
  student,
  base64,
}: {
  student: AddStudentSchemaType;
  base64: string | null;
}) => {
  try {
    const { success, data } = AddStudentSchema.safeParse(student);
    if (!success) {
      return { message: "Invalid data !" };
    }
    const { id: madrashaId } = await auth();

    const imgInfo = await uploadToCloude({
      base64,
      folder: "student",
    });

    // generate student id
    const uniqueId = await generateUniqueStudentId(madrashaId);
    //insert data

    //checking limits
    const [{ total }] = await db
      .select({ total: count() })
      .from(students)
      .where(eq(students.madrashaId, madrashaId));

    if (total >= 500) {
      return {
        error:
          "You can't add more that 500 students : basic plan : limit : up to 500 students",
      };
    }
    await db.insert(students).values({
      name: data.name,
      madrashaId,
      fatherName: data.fatherName,
      motherName: data.motherName,
      address: data.address!,
      studentCourse: data.course!,
      dataOfBirth: data.dateOfBirth,
      gender: data.gender!,
      studentIdNO: uniqueId,
      imageUrl: imgInfo.secure_url,
      imagePublicId: imgInfo.public_id,
      sessionLength: data.sessionLength!,
      sessionDurationInYear: Number(data.sessionDuration),
      physicalCondition: data.physicalCondition,
      admissionTimePaid: Number(data.admissionTimePaid),
    });
    return { message: "New Student Created " };
  } catch (error) {
    return handleServerError(error);
  }
};

export const getSingleStudent = async ({ id }: { id: string }) => {
  try {
    const { id: madrashaId } = await auth();
    const [student] = await db
      .select()
      .from(students)
      .where(and(eq(students.id, id), eq(students.madrashaId, madrashaId)));

    return { student };
  } catch (error) {
    console.log(error);

    return { student: null };
  }
};

export const updateStudent = async ({
  student,
  base64,
}: {
  student: DBStudentType;
  base64: string | null;
}) => {
  try {
    const { id: madrashaId } = await auth();
    const imgInfo = await uploadToCloude({
      base64,
      folder: "student",
    });
    if (!student.imageUrl && student.imagePublicId) {
      await deleteFromCloude(student.imagePublicId!);
    }

    const studentInfo: DBStudentType = {
      ...student,

      imageUrl: student.imageUrl || imgInfo.secure_url,
      imagePublicId: student.imageUrl
        ? student.imagePublicId
        : imgInfo.public_id,
    };

    //insert data
    await db
      .update(students)
      .set(studentInfo)
      .where(
        and(eq(students.id, student.id), eq(students.madrashaId, madrashaId))
      );
    return { message: " Student Updated " };
  } catch (error) {
    return handleServerError(error);
  }
};

// query
export const getStudentsForTable = async ({
  limit,
  offset,
  search,
  sorting,
  course,
  sessionLength,
  duration,
}: {
  limit: number;
  offset: number;
  search?: string;
  sorting?: SortingState;
  course: StudentCourseEnumType | "all";
  sessionLength: string | "all";
  duration: string;
}) => {
  try {
    const { id: madrashaId, madrashaName } = await auth();
    const studentQuery = db
      .select({
        id: students.id,
        imageUrl: students.imageUrl,
        imagePublicId: students.imagePublicId,
        name: students.name,
        studentIdNo: students.studentIdNO,
        sessionLength: students.sessionLength,
        course: students.studentCourse,
        result: students.result,
        sessionDuration: students.sessionDurationInYear,
      })
      .from(students);

    const conditions = [];
    if (search) {
      conditions.push(ilike(students.name, `%${search}%`));
    }

    if (course !== "all") {
      conditions.push(eq(students.studentCourse, course));
    }
    if (duration) {
      conditions.push(eq(students.sessionDurationInYear, Number(duration)));
    }

    if (sessionLength !== "all") {
      conditions.push(eq(students.sessionLength, sessionLength));
    }

    if (conditions.length) {
      studentQuery.where(
        and(...conditions, eq(students.madrashaId, madrashaId))
      );
    } else {
      studentQuery.where(eq(students.madrashaId, madrashaId));
    }

    let sortInfo: SQL<unknown> | null = null;
    if (sorting?.length) {
      if (sorting[0].id === "name") {
        sortInfo = sorting[0].desc ? desc(students.name) : asc(students.name);
      }

      if (sortInfo) {
        studentQuery.orderBy(sortInfo);
      } else {
        studentQuery.orderBy(students.createdAt);
      }
    }
    const allStudents = await studentQuery.limit(limit).offset(offset);

    const [{ studentCount }] = await db
      .select({ studentCount: count() })
      .from(students)
      .where(and(...conditions));

    return {
      allStudents,
      studentCount,
      madrashaName: madrashaName ?? "N/A",
    };
  } catch (error) {
    return handleServerError(error);
  }
};

export const publishStudentResult = async ({
  result,
  studentId,
}: {
  result: (typeof RESULTS_ARR)[number];
  studentId: string;
}) => {
  try {
    await db.update(students).set({ result }).where(eq(students.id, studentId));
    return { message: "Result published" };
  } catch (error) {
    return handleServerError(error);
  }
};

export const deleteStudent = async ({
  studentId,
  imagePublicId,
}: {
  studentId: string;
  imagePublicId: string | null;
}) => {
  try {
    await db.delete(students).where(eq(students.id, studentId));
    if (imagePublicId) {
      await deleteFromCloude(imagePublicId);
    }
    return { message: "Student Deleted" };
  } catch (error) {
    return handleServerError(error);
  }
};
