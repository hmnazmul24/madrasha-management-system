import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_MADRASHA_USERNAME_PREFIX: z.string().min(1),
    NEXT_PUBLIC_MADRASHA_PASSWORD_PREFIX: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_MADRASHA_USERNAME_PREFIX:
      process.env.NEXT_PUBLIC_MADRASHA_USERNAME_PREFIX,
    NEXT_PUBLIC_MADRASHA_PASSWORD_PREFIX:
      process.env.NEXT_PUBLIC_MADRASHA_PASSWORD_PREFIX,
  },
});
