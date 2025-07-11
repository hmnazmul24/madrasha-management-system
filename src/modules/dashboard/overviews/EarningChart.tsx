"use client";

import { useQueries } from "@tanstack/react-query";
import { useEffect } from "react";
import { CircleChart } from "./CircleChart";
import { getAllEarnings } from "./server/analytics.action";
import { useAmountStore } from "./store/use-amount";

export default function EarningChart() {
  const { setEarnings, resetEarnings } = useAmountStore();
  const results = useQueries({
    queries: [
      {
        queryKey: ["donationsData"],
        queryFn: async () => {
          const data = await getAllEarnings();
          setEarnings(data.totalAmountsFormDonation);
          return { totalAmountsFormDonation: data.totalAmountsFormDonation };
        },
      },
      {
        queryKey: ["admissionPayments"],
        queryFn: async () => {
          const data = await getAllEarnings();
          setEarnings(data.totalAmountsAddmissionTimePayment);
          return {
            totalAmountsAddmissionTimePayment:
              data.totalAmountsAddmissionTimePayment,
          };
        },
      },
      {
        queryKey: ["mealFees"],
        queryFn: async () => {
          const data = await getAllEarnings();
          setEarnings(data.mealFees);
          return { mealFees: data.mealFees };
        },
      },
      {
        queryKey: ["educationFees"],
        queryFn: async () => {
          const data = await getAllEarnings();
          setEarnings(data.educationFees);
          return { educationFees: data.educationFees };
        },
      },
      {
        queryKey: ["vehicleFees"],
        queryFn: async () => {
          const data = await getAllEarnings();
          setEarnings(data.vehicleFees);
          return { vehicleFees: data.vehicleFees };
        },
      },
      {
        queryKey: ["additionalFees"],
        queryFn: async () => {
          const data = await getAllEarnings();
          setEarnings(data.additionalFees);
          return { additionalFees: data.additionalFees };
        },
      },
    ],
  });

  const [
    { data: donationData, isLoading: donationLoading },
    { data: admissionData, isLoading: admissionLoading },
    { data: mealData, isLoading: mealLoading },
    { data: educationData, isLoading: educationLoading },
    { data: vehicleFeesData, isLoading: vehicleFeesLoading },
    { data: additionalFeesData, isLoading: additionalFeeLoading },
  ] = results;

  useEffect(() => {
    resetEarnings();
  }, [resetEarnings]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
      {/* Donations */}
      <CircleChart
        title="totalDonations"
        amount={donationData?.totalAmountsFormDonation}
        isPending={donationLoading}
        color="violet"
      />

      {/* Admission Payments */}
      <CircleChart
        title="totalAdmissionPayments"
        amount={admissionData?.totalAmountsAddmissionTimePayment}
        isPending={admissionLoading}
        color="green"
      />

      {/* Meal Fees */}
      <CircleChart
        title="totalMealFees"
        amount={mealData?.mealFees}
        isPending={mealLoading}
        color="tomato"
      />

      {/* education */}
      <CircleChart
        title="totalEducationFees"
        amount={educationData?.educationFees}
        isPending={educationLoading}
        color="aqua"
      />
      <CircleChart
        title="totalVehicleFees"
        amount={vehicleFeesData?.vehicleFees}
        isPending={vehicleFeesLoading}
        color="blue"
      />
      <CircleChart
        title="totalAdditionalFees"
        amount={additionalFeesData?.additionalFees}
        isPending={additionalFeeLoading}
        color="white"
      />
    </div>
  );
}
