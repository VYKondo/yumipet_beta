import { env } from "@/lib/env.server";

const GRAPH_API_VERSION = "v21.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export type WhatsAppSendResult = {
  metaMessageId: string;
};

export type WhatsAppSendError = {
  error: string;
};

/**
 * Envia mensagem de texto simples via WhatsApp Cloud API (Meta).
 * Retorna o metaMessageId em caso de sucesso.
 */
export async function sendTextMessage(
  to: string,
  text: string
): Promise<WhatsAppSendResult> {
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = env;

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    throw new Error("WhatsApp não configurado (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID ausentes)");
  }

  const url = `${GRAPH_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace(/^\+/, ""),
      type: "text",
      text: { body: text },
    }),
  });

  const json = await res.json();

  if (!res.ok || json.error) {
    const errMsg =
      json?.error?.message ?? `WhatsApp API retornou status ${res.status}`;
    throw new Error(errMsg);
  }

  const metaMessageId: string | undefined = json?.messages?.[0]?.id;
  if (!metaMessageId) {
    throw new Error("WhatsApp API não retornou id da mensagem");
  }

  return { metaMessageId };
}

/**
 * Envia mensagem usando template pré-aprovado (para o primeiro contato do dia).
 */
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  bodyParams: string[]
): Promise<WhatsAppSendResult> {
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = env;

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    throw new Error("WhatsApp não configurado (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID ausentes)");
  }

  const url = `${GRAPH_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace(/^\+/, ""),
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components: [
          {
            type: "body",
            parameters: bodyParams.map((text) => ({ type: "text", text })),
          },
        ],
      },
    }),
  });

  const json = await res.json();

  if (!res.ok || json.error) {
    const errMsg =
      json?.error?.message ?? `WhatsApp API retornou status ${res.status}`;
    throw new Error(errMsg);
  }

  const metaMessageId: string | undefined = json?.messages?.[0]?.id;
  if (!metaMessageId) {
    throw new Error("WhatsApp API não retornou id da mensagem");
  }

  return { metaMessageId };
}

/**
 * Verifica a assinatura X-Hub-Signature-256 do webhook.
 */
export async function verifyWebhookSignature(
  body: string,
  signature: string | null
): Promise<boolean> {
  const { WHATSAPP_APP_SECRET } = env;
  if (!WHATSAPP_APP_SECRET) return false;
  if (!signature) return false;

  const crypto = await import("crypto");
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", WHATSAPP_APP_SECRET).update(body).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}
