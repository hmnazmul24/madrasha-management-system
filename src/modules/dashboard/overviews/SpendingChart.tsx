"use client";

import React from "react";
import { CircleChart } from "./CircleChart";
import { SpendingBar } from "./SpendingBar";
import { useQuery } from "@tanstack/react-query";
import { getAllSpendings } from "./server/analytics.action";
import Loading from "../components/Loading";
import { useAmountStore } from "./store/use-amount";

const SpendingChart = () => {
  const { setAllSpending } = useAmountStore();
  const { data, isPending } = useQuery({
    queryKey: ["allSpendings"],
    queryFn: async () => {
      const data = await getAllSpendings();
      setAllSpending(data.allAmount);
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
  if (!data?.allAmountAndFields) {
    return <div className="text-gray-100">Nothing Added Yet !</div>;
  }

  console.log(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 p-2">
      <div className="grid grid-cols-1 gap-3">
        <CircleChart
          amount={Number(data.allAmount)}
          isPending={isPending}
          title="totalSpendings"
          color="yellow"
          className="place-self-start w-full"
        />
        <CircleChart
          amount={Number(data.totalTeacherSalary)}
          isPending={isPending}
          title="onlyTeacherSalarySum"
          color="aqua"
          className="place-self-start w-full"
        />
      </div>

      <SpendingBar info={data.allAmountAndFields} />
    </div>
  );
};

export default SpendingChart;
