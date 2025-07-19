"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Download, Printer } from "lucide-react";
import { recentStatus } from "./server/analytics.action";

import { useTranslations } from "next-intl";
import {
  calculateTotals,
  formatLongNumber,
  generate90DaySummary,
} from "./helper";
import { generateSummaryPDF } from "./helper/pdf-and-print";

export const description = "An interactive area chart";

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--chart-1)",
  },
  spendings: {
    label: "Spendings",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type TimeRangeType = "7d" | "30d" | "90d";
export function ChartAreaInteractive() {
  const t = useTranslations("term");
  const [timeRange, setTimeRange] = React.useState<TimeRangeType>("90d");

  const { data, isPending, error } = useQuery({
    queryKey: ["allEarningsData"],
    queryFn: () => recentStatus(),
  });

  if (isPending) {
    return (
      <Skeleton className="w-full h-[380px] border rounded-md bg-transparent backdrop-blur-xl"></Skeleton>
    );
  }
  if (error) {
    return (
      <div className="text-emerald-500">
        Server issue , try to refresh the page.
      </div>
    );
  }

  const zeroTime = (d: Date) => new Date(d.toDateString());

  const chartData = [...generate90DaySummary(data)];

  const filteredData = chartData.filter((item) => {
    const date = zeroTime(new Date(item.date));
    const referenceDate = zeroTime(new Date()); // use today, not fixed date

    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(referenceDate.getDate() - daysToSubtract);

    return date >= startDate;
  });

  return (
    <Card className="pt-0 bg-transparent backdrop-blur-xs">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>
            {t("earnings")} -{" "}
            <span className="text-2xl font-black text-blue-500">
              {formatLongNumber(calculateTotals(filteredData).totalEarnings)}{" "}
            </span>{" "}
            : {t("spendings")} -{" "}
            <span className="text-2xl text-red-400 font-black">
              {formatLongNumber(
                calculateTotals(filteredData).totalSpendings +
                  Number(data.totalTeacherSalarySpent)
              )}
            </span>
          </CardTitle>
          <CardDescription>
            Showing total earnings/spendings for the last{" "}
            <span className="text-yellow-500">{timeRange}</span>
          </CardDescription>
          <div className="flex gap-2">
            <Button
              onClick={() => generateSummaryPDF(data, timeRange, "print")}
            >
              {t("print")} <Printer />
            </Button>
            <Button
              onClick={() => generateSummaryPDF(data, timeRange, "download")}
            >
              {t("pdfDownload")} <Download />
            </Button>
          </div>
        </div>
        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as TimeRangeType)}
        >
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-spendings)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-spendings)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-earnings)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-earnings)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="earnings"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-earnings)"
              stackId="a"
            />
            <Area
              dataKey="spendings"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-spendings)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
