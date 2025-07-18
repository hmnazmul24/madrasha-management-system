import { db } from "@/drizzle/db";
import { salaryPayments, teachers } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export const totalTeacherSalaryHelper = async (
  madrashaId: string
): Promise<number> => {
  const result = await db
    .select({
      totalPaid: sql<number>`SUM(${salaryPayments.amountPaid} + ${salaryPayments.bonus})`,
    })
    .from(salaryPayments)
    .innerJoin(teachers, eq(salaryPayments.teacherId, teachers.id))
    .where(eq(teachers.madrashaId, madrashaId));

  return result[0]?.totalPaid ?? 0;
};
