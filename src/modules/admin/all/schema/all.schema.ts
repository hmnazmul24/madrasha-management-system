import { z } from "zod";

export const editMadrashaSchema = z.object({
  institutionName: z.string().min(1, "Institution name is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  contactNumber: z
    .string()
    .min(11, "Contact number is invalid")
    .max(11, "Contact number is invalid"),
  address: z.string().min(1, "Address is required"),
  oneTimePaid: z.string().min(1, "Must be an integer"),
});
