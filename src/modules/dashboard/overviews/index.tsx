import React from "react";
import EarningChart from "./EarningChart";
import SpendingChart from "./SpendingChart";
import Total from "./Total";
import { ChartAreaInteractive } from "./ChartAreaInteractive";
import NewAddedTag from "../layouts/NewAddedTag";

export const DashboardOverView = () => {
  return (
    <div>
      <div className="mb-3 mt-2">
        <NewAddedTag className="-top-3 left-24">
          <h1 className="ml-3 text-white">Recent Status</h1>
        </NewAddedTag>
        <ChartAreaInteractive />
      </div>
      <h1 className="ml-3 text-white">All Earnings</h1>
      <EarningChart />
      <h1 className="ml-3 text-white mb-1 mt-2 ">All Spendings</h1>
      <SpendingChart />
      <h1 className="ml-3 text-white mb-1 mt-2 ">Total</h1>
      <Total />
    </div>
  );
};
