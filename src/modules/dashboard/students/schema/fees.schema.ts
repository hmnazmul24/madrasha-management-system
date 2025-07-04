import { z } from "zod";

export const studentFeesSchema = z.object({
  meal_fees: z.string().min(1),
  education_fee: z.string().min(1),
  vehicle_fees: z.string().optional(),
  additional_fees: z.string().optional(),
  session: z.string(),
  month: z.string(),
  year: z.string().optional(),
});
