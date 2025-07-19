import { useTranslations } from "next-intl";
import { ChartAreaInteractive } from "./ChartAreaInteractive";
import EarningChart from "./EarningChart";
import SpendingChart from "./SpendingChart";
import Total from "./Total";

export const DashboardOverView = () => {
  const t = useTranslations("term");

  return (
    <div>
      <div className="mb-3 mt-2">
        <h1 className="ml-3 text-white">{t("recentStatus")}</h1>

        <ChartAreaInteractive />
      </div>
      <h1 className="ml-3 text-white">{t("allEarnings")}</h1>
      <EarningChart />
      <h1 className="ml-3 text-white mb-1 mt-2 ">{t("allSpendings")}</h1>
      <SpendingChart />
      <h1 className="ml-3 text-white mb-1 mt-2 ">{t("total")}</h1>
      <Total />
    </div>
  );
};
