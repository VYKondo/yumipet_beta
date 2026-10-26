import { z } from "zod";

export const messageTemplateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  metaTemplateName: z.string().min(1, "Nome do template Meta é obrigatório").max(100),
  languageCode: z.string().min(2).max(10).default("pt_BR"),
  variableOrder: z.array(z.string().min(1)).min(1, "Ordem de variáveis é obrigatória"),
  previewContent: z.string().min(1, "Prévia é obrigatória").max(1000),
  active: z.boolean().optional().default(true),
});

export type MessageTemplateInput = z.infer<typeof messageTemplateSchema>;
