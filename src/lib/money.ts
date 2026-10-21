import { Decimal } from "@prisma/client/runtime/library";

export function formatBRL(value: Decimal | string | number): string {
  const num = typeof value === "object" ? value.toNumber() : Number(value);
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
