import { z } from "zod";

export const settingsSchema = z.object({
  businessName: z.string().min(1, "Nome do negócio é obrigatório").max(100),
  phone: z.string().min(8, "Telefone inválido").max(20).optional().nullable(),
  timezone: z.string().min(1).max(50).default("America/Sao_Paulo"),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
