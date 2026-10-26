import { z } from "zod";

export const appointmentStatusEnum = z.enum([
  "SCHEDULED",
  "CONFIRMED",
  "DONE",
  "CANCELED",
  "NO_SHOW",
]);

export const createAppointmentSchema = z
  .object({
    dogId: z.string().uuid("Cão inválido"),
    serviceId: z.string().uuid("Serviço inválido"),
    scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data/hora inválida",
    }),
    durationMin: z
      .number()
      .int("Duração deve ser um número inteiro")
      .min(1, "Duração deve ser pelo menos 1 minuto")
      .max(600, "Duração máxima de 600 minutos"),
    price: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Preço inválido")
      .transform((val) => parseFloat(val)),
    taxidogPrice: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Preço do taxidog inválido")
      .transform((val) => parseFloat(val))
      .default(0),
    notes: z.string().max(500).nullable().optional(),
    contactPhone: z.string().min(8, "Telefone inválido").max(20).optional(),
    status: appointmentStatusEnum.optional().default("SCHEDULED"),
  })
  .refine((data) => data.price >= 0, {
    message: "Preço deve ser maior ou igual a zero",
    path: ["price"],
  })
  .refine((data) => data.taxidogPrice >= 0, {
    message: "Preço do taxidog deve ser maior ou igual a zero",
    path: ["taxidogPrice"],
  });

export const updateAppointmentSchema = z
  .object({
    dogId: z.string().uuid("Cão inválido").optional(),
    serviceId: z.string().uuid("Serviço inválido").optional(),
    scheduledAt: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Data/hora inválida",
      })
      .optional(),
    durationMin: z
      .number()
      .int("Duração deve ser um número inteiro")
      .min(1, "Duração deve ser pelo menos 1 minuto")
      .max(600, "Duração máxima de 600 minutos")
      .optional(),
    price: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Preço inválido")
      .transform((val) => parseFloat(val))
      .optional(),
    taxidogPrice: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Preço do taxidog inválido")
      .transform((val) => parseFloat(val))
      .optional(),
    notes: z.string().max(500).nullable().optional(),
    contactPhone: z.string().min(8, "Telefone inválido").max(20).optional(),
    status: appointmentStatusEnum.optional(),
  })
  .refine((data) => data.price === undefined || data.price >= 0, {
    message: "Preço deve ser maior ou igual a zero",
    path: ["price"],
  })
  .refine((data) => data.taxidogPrice === undefined || data.taxidogPrice >= 0, {
    message: "Preço do taxidog deve ser maior ou igual a zero",
    path: ["taxidogPrice"],
  });

export const listAppointmentsQuerySchema = z.object({
  from: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Data inicial inválida" })
    .optional(),
  to: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Data final inválida" })
    .optional(),
  status: appointmentStatusEnum.optional(),
  dogId: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>;
export type AppointmentStatus = z.infer<typeof appointmentStatusEnum>;
export type ListAppointmentsResult = {
  items: import("@prisma/client").Appointment[];
  total: number;
  page: number;
  pageSize: number;
};
