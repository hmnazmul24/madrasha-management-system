import { db } from "@/drizzle/db";
import { students } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const generateUniqueStudentId = async (
  madrashaId: string
): Promise<string> => {
  let studentIdNo = "";
  let unique = false;

  while (!unique) {
    const num = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    const idNo = num;

    const [isStudentIdNoExist] = await db
      .select()
      .from(students)
      .where(
        and(eq(students.madrashaId, madrashaId), eq(students.studentIdNO, idNo))
      );

    if (!isStudentIdNoExist) {
      studentIdNo = idNo; // ✅ assign the ID here
      unique = true;
    }
  }

  return studentIdNo;
};
