import { z } from "zod";

export const reportsQuerySchema = z.object({
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
});

export type ReportsQuery = z.infer<typeof reportsQuerySchema>;
