"use client";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import { getTeacherAndStudentCounts } from "./server/analytics.action";
import { useAmountStore } from "./store/use-amount";
import TotalCard from "./TotalCard";

const Total = () => {
  const info = useAmountStore();
  const { data, isPending } = useQuery({
    queryKey: ["allteacherAndStudents"],
    queryFn: async () => {
      const data = await getTeacherAndStudentCounts();
      return data;
    },
  });
  if (isPending) {
    return (
      <div className="min-h-[350px] flex items-center justify-center m-auto w-full text-white">
        <Loading />
      </div>
    );
  }

  if (!data) {
    return <div>Nothing to show !</div>;
  }

  const totalEarings = info.earnings.reduce((prev, curr) => prev + curr);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr] gap-3 bg-transparent p-2">
      <TotalCard info={[{ title: "teachers", amount: data.teacherCount }]} />
      <TotalCard info={[{ title: "students", amount: data.studentCount }]} />
      <TotalCard
        info={[
          { title: "totalEarningsTaka", amount: totalEarings },
          { title: "totalSpendingTaka", amount: info.allSpending },
          {
            title: "totalRevenueTaka",
            amount: totalEarings - info.allSpending,
          },
        ]}
      />
    </div>
  );
};

export default Total;
