import { gotDataType } from "../types";

const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
  compactDisplay: "short",
});

export const formatLongNumber = (num: number) => formatter.format(num);

// adjust import as needed

type DayInfo = {
  date: string;
  earnings: number;
  spendings: number;
};

export function generate90DaySummary(data: gotDataType): DayInfo[] {
  const result: DayInfo[] = [];
  const today = new Date();

  // Utility: format date to "YYYY-MM-DD"
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // Create a map to aggregate earnings
  const earningsMap = new Map<string, number>();
  data.earnings.donationData.forEach(({ date, amount }) => {
    const d = formatDate(new Date(date));
    earningsMap.set(d, (earningsMap.get(d) || 0) + (amount || 0));
  });
  data.earnings.admissionData.forEach(({ date, admissionTimePaid }) => {
    const d = formatDate(new Date(date));
    earningsMap.set(d, (earningsMap.get(d) || 0) + (admissionTimePaid || 0));
  });
  data.earnings.studentFeeData.forEach(({ date, mealFees, educationFees }) => {
    const d = formatDate(new Date(date));
    const total = (mealFees || 0) + (educationFees || 0);
    earningsMap.set(d, (earningsMap.get(d) || 0) + total);
  });

  // Create a map to aggregate spendings
  const spendingMap = new Map<string, number>();
  data.spending.allSpendings.forEach(({ date, amount }) => {
    const d = formatDate(new Date(date));
    spendingMap.set(d, (spendingMap.get(d) || 0) + (amount || 0));
  });

  // Generate the past 90 days from today
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = formatDate(date);

    result.push({
      date: formattedDate,
      earnings: earningsMap.get(formattedDate) || 0,
      spendings: spendingMap.get(formattedDate) || 0,
    });
  }

  return result.reverse(); // earliest date first
}

type ChartData = {
  date: string;
  earnings: number;
  spendings: number;
};

export function calculateTotals(data: ChartData[]) {
  return data.reduce(
    (acc, curr) => {
      acc.totalEarnings += curr.earnings;
      acc.totalSpendings += curr.spendings;
      return acc;
    },
    { totalEarnings: 0, totalSpendings: 0 }
  );
}
