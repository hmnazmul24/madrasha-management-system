"use server";

import { db } from "@/drizzle/db";
import {
  donations,
  spendings,
  studentFees,
  students,
  teachers,
} from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { SPENDING_FIELDS } from "../../spendings/constants";
import { auth } from "@/modules/marketing/server/user.action";

export async function getAllEarnings() {
  const { id: madrashaId } = await auth();
  const [donationData, admissionData, studentFeeData] = await Promise.all([
    db
      .select({ amount: donations.amount })
      .from(donations)
      .where(eq(donations.madrashaId, madrashaId)),
    db
      .select({ admissionTimePaid: students.admissionTimePaid })
      .from(students)
      .where(eq(students.madrashaId, madrashaId)),
    // todo student fees
    db
      .select({
        mealFees: studentFees.mealFees,
        educationFees: studentFees.educationFees,
      })
      .from(studentFees)
      .innerJoin(students, eq(studentFees.studentId, students.id))
      .where(eq(students.madrashaId, madrashaId)),
  ]);

  const totalAmountsFormDonation = donationData.length
    ? donationData.reduce((acc, item) => acc + (item.amount ?? 0), 0)
    : 0;

  const totalAmountsAddmissionTimePayment = admissionData.length
    ? admissionData.reduce(
        (acc, item) => acc + (item.admissionTimePaid ?? 0),
        0
      )
    : 0;

  const mealFees = studentFeeData.length
    ? studentFeeData.reduce((acc, item) => acc + (item.mealFees ?? 0), 0)
    : 0;

  const educationFees = studentFeeData.length
    ? studentFeeData.reduce((acc, item) => acc + (item.educationFees ?? 0), 0)
    : 0;

  return {
    totalAmountsFormDonation,
    totalAmountsAddmissionTimePayment,
    mealFees,
    educationFees,
  };
}

export const getAllSpendings = async () => {
  const { id: madrashaId } = await auth();
  const allSpendings = await db
    .select({ amount: spendings.amount, field: spendings.spendingField })
    .from(spendings)
    .where(eq(spendings.madrashaId, madrashaId));

  const allAmount = allSpendings.reduce((prev, current) => {
    return prev + current.amount;
  }, 0);

  const allAmountAndFields = SPENDING_FIELDS.map((item) => {
    const match = allSpendings.find((info) => info.field === item);
    return {
      field: item,
      amount: match?.amount ?? 0,
    };
  });

  return { allAmount, allAmountAndFields };
};
export const getTeacherAndStudentCounts = async () => {
  const { id: madrashaId } = await auth();
  const [{ studentCount }] = await db
    .select({ studentCount: count() })
    .from(students)
    .where(eq(students.madrashaId, madrashaId));
  const [{ teacherCount }] = await db
    .select({ teacherCount: count() })
    .from(teachers)
    .where(eq(teachers.madrashaId, madrashaId));

  return { studentCount, teacherCount };
};
