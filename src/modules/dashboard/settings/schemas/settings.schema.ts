import { z } from "zod";

// Zod Schema for validation
export const settingSchema = z.object({
  oldPassword: z
    .string()
    .min(5, { message: "old password must be at least 5 char" }),
  newPassword: z
    .string()
    .min(5, { message: "new password must be at least 5 char" }),
  newConfirmPassword: z
    .string()
    .min(5, { message: "confirm password must be at least 5 char" }),
});
