import { z } from "zod";
import type { Dog } from "@prisma/client";

export const createDogSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  breed: z.string().max(100).nullable().optional(),
  tutorName: z.string().min(1, "Nome do tutor é obrigatório").max(100),
  tutorPhone: z.string().min(8, "Telefone inválido").max(20),
  active: z.boolean().optional().default(true),
});

export const updateDogSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  breed: z.string().max(100).nullable().optional(),
  tutorName: z.string().min(1).max(100).optional(),
  tutorPhone: z.string().min(8).max(20).optional(),
  active: z.boolean().optional(),
});

export const listDogsQuerySchema = z.object({
  search: z.string().optional(),
  active: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === undefined ? undefined : val === "true"),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type CreateDogInput = z.infer<typeof createDogSchema>;
export type UpdateDogInput = z.infer<typeof updateDogSchema>;
export type ListDogsQuery = z.infer<typeof listDogsQuerySchema>;

export type ListDogsResult = {
  items: Dog[];
  total: number;
  page: number;
  pageSize: number;
};
