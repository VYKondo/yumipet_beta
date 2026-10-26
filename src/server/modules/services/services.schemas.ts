import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  basePrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Preço inválido")
    .transform((val) => parseFloat(val)),
  defaultDurationMin: z
    .number()
    .int("Duração deve ser um número inteiro")
    .min(1, "Duração deve ser pelo menos 1 minuto")
    .max(600, "Duração máxima de 600 minutos"),
  active: z.boolean().optional().default(true),
});

export const updateServiceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  basePrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Preço inválido")
    .transform((val) => parseFloat(val))
    .optional(),
  defaultDurationMin: z
    .number()
    .int("Duração deve ser um número inteiro")
    .min(1, "Duração deve ser pelo menos 1 minuto")
    .max(600, "Duração máxima de 600 minutos")
    .optional(),
  active: z.boolean().optional(),
});

export const listServicesQuerySchema = z.object({
  search: z.string().optional(),
  active: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === undefined ? undefined : val === "true"),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ListServicesQuery = z.infer<typeof listServicesQuerySchema>;
export type ListServicesResult = {
  items: import("@prisma/client").Service[];
  total: number;
  page: number;
  pageSize: number;
};
