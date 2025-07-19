import { SpendingFieldsEnum } from "../../spendings/types/type";

export type gotDataType = {
  earnings: {
    donationData: {
      amount: number | null;
      donor: string;
      date: Date;
    }[];
    admissionData: {
      admissionTimePaid: number | null;
      date: Date;
    }[];
    studentFeeData: {
      mealFees: number;
      educationFees: number;
      date: Date;
    }[];
  };
  spending: {
    allSpendings: {
      amount: number;
      field: SpendingFieldsEnum;
      date: Date;
    }[];
  };
};

type DayInfo = {
  date: string;
  spendings: {
    info: {
      field: SpendingFieldsEnum;
      amount: number;
    }[];
    totalSpending: number;
  };
  earnings: {
    info: {
      amount: number;
      from: "donations" | "addmissions" | "studentFees";
    }[];
    totalSpending: number;
  };
};

export function create90daysSummeryData(info: gotDataType): DayInfo[] {
  const resultMap = new Map<string, DayInfo>();

  const formatDate = (date: Date): string =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate())
      .toISOString()
      .split("T")[0];

  const addSpending = (
    date: Date,
    amount: number,
    field: SpendingFieldsEnum
  ) => {
    const dateStr = formatDate(date);
    const existing = resultMap.get(dateStr);

    if (!existing) {
      resultMap.set(dateStr, {
        date: dateStr,
        spendings: {
          info: [{ field, amount }],
          totalSpending: amount,
        },
        earnings: {
          info: [],
          totalSpending: 0,
        },
      });
    } else {
      const spendInfo = existing.spendings;
      spendInfo.totalSpending += amount;

      const existingField = spendInfo.info.find((item) => item.field === field);
      if (existingField) {
        existingField.amount += amount;
      } else {
        spendInfo.info.push({ field, amount });
      }
    }
  };

  const addEarning = (
    date: Date,
    amount: number,
    from: "donations" | "addmissions" | "studentFees"
  ) => {
    const dateStr = formatDate(date);
    const existing = resultMap.get(dateStr);

    if (!existing) {
      resultMap.set(dateStr, {
        date: dateStr,
        spendings: {
          info: [],
          totalSpending: 0,
        },
        earnings: {
          info: [{ amount, from }],
          totalSpending: amount,
        },
      });
    } else {
      const earnInfo = existing.earnings;
      earnInfo.totalSpending += amount;
      earnInfo.info.push({ amount, from });
    }
  };

  // Process spendings
  for (const spend of info.spending.allSpendings) {
    addSpending(spend.date, spend.amount, spend.field);
  }

  // Process earnings
  for (const donation of info.earnings.donationData) {
    if (donation.amount !== null) {
      addEarning(donation.date, donation.amount, "donations");
    }
  }

  for (const admission of info.earnings.admissionData) {
    if (admission.admissionTimePaid !== null) {
      addEarning(admission.date, admission.admissionTimePaid, "addmissions");
    }
  }

  for (const studentFee of info.earnings.studentFeeData) {
    const total = studentFee.mealFees + studentFee.educationFees;
    addEarning(studentFee.date, total, "studentFees");
  }

  // Get only last 90 days sorted
  const today = new Date();
  const last90Days = Array.from(resultMap.values())
    .filter((entry) => {
      const entryDate = new Date(entry.date);
      const diffInMs = today.getTime() - entryDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      return diffInDays <= 90;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return last90Days;
}
