import { z } from "zod";
import { madrashaSchema } from "../schema/create.schema";

export type MadrashSchemaType = z.infer<typeof madrashaSchema>;
