export type gotDataType = {
  earnings: {
    donationData: {
      amount: number | null;
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
      date: Date;
    }[];
  };
};
