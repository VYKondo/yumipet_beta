import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { env } from "@/lib/env.server";
import { verifyWebhookSignature } from "@/server/whatsapp/client";

/**
 * GET — verificação do webhook pela Meta (hub.challenge).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN && challenge) {
    return new Response(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * POST — eventos do WhatsApp (mensagens recebidas + status de entrega).
 * Verifica X-Hub-Signature-256 antes de processar.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  const valid = await verifyWebhookSignature(rawBody, signature);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Processar entradas do webhook
  const entries = (body as { entry?: Array<{ changes?: Array<{ value?: unknown }> }> })
    ?.entry;

  if (!Array.isArray(entries)) {
    return NextResponse.json({ received: true });
  }

  for (const entry of entries) {
    const changes = entry.changes ?? [];
    for (const change of changes) {
      const value = change.value as {
        messages?: Array<{
          id: string;
          from: string;
          timestamp: string;
          type: string;
          text?: { body?: string };
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          recipient_id: string;
          timestamp: string;
          errors?: Array<{ code: number; title: string }>;
        }>;
      };

      // Mensagens recebidas (INBOUND)
      if (Array.isArray(value?.messages)) {
        for (const msg of value.messages) {
          await logInboundMessage(msg.from, msg.id, msg.text?.body ?? "");
        }
      }

      // Status de entrega (atualizar log OUTBOUND correspondente)
      if (Array.isArray(value?.statuses)) {
        for (const status of value.statuses) {
          await updateDeliveryStatus(status.id, status.status, status.errors);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function logInboundMessage(
  from: string,
  metaMessageId: string,
  text: string
): Promise<void> {
  // Encontrar o agendamento mais recente com esse telefone
  const phone = from.startsWith("+") ? from : `+${from}`;
  const appointment = await prisma.appointment.findFirst({
    where: {
      contactPhone: phone,
      status: { in: ["SCHEDULED", "CONFIRMED"] },
    },
    orderBy: { scheduledAt: "desc" },
  });

  if (!appointment) return;

  await prisma.whatsappLog.create({
    data: {
      appointmentId: appointment.id,
      direction: "INBOUND",
      status: "RECEIVED",
      metaMessageId,
      error: text ? `Conteúdo: ${text.slice(0, 500)}` : null,
    },
  });
}

async function updateDeliveryStatus(
  metaMessageId: string,
  status: string,
  errors?: Array<{ code: number; title: string }>
): Promise<void> {
  const log = await prisma.whatsappLog.findFirst({
    where: { metaMessageId },
    orderBy: { createdAt: "desc" },
  });

  if (!log) return;

  if (status === "failed") {
    const errMsg = errors?.map((e) => `${e.code}: ${e.title}`).join("; ") ?? "Falha na entrega";
    await prisma.whatsappLog.update({
      where: { id: log.id },
      data: { status: "FAILED", error: errMsg },
    });
  }
}
