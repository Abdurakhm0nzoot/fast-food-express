import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "crypto";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat?: { id?: number; title?: string; type?: string };
    from?: { first_name?: string; username?: string };
  };
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function webhookSecret() {
  const token = process.env.TELEGRAM_SELLER_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_SELLER_BOT_TOKEN is not configured");
  return createHash("sha256").update(`olovfood-seller-webhook:${token}`).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function sendSellerMessage(chatId: number, text: string) {
  const token = process.env.TELEGRAM_SELLER_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_SELLER_BOT_TOKEN is not configured");
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

export const Route = createFileRoute("/api/public/telegram/seller-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const actualSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        if (!safeEqual(actualSecret, webhookSecret())) {
          return new Response("Unauthorized", { status: 401 });
        }

        const update = (await request.json()) as TelegramUpdate;
        const message = update.message;
        const chatId = message?.chat?.id;
        const text = message?.text?.trim();

        if (!chatId || !text) {
          return Response.json({ ok: true, ignored: true });
        }

        if (text === "/start" || text.startsWith("/start@")) {
          const name = message.from?.first_name ?? message.from?.username ?? "sotuvchi";
          await sendSellerMessage(
            chatId,
            `🛒 <b>OlovFood sotuvchi bot</b>\n\nSalom, ${escapeHtml(name)}!\n\nChat ID: <code>${chatId}</code>\n\nShu ID ni <b>TELEGRAM_SELLER_CHAT_ID</b> ga qo'ying. Keyin har bir buyurtma shu chatga ham keladi.`,
          );
        }

        return Response.json({ ok: true });
      },
      GET: async () => Response.json({ ok: true, bot: "OlovFood Seller" }),
    },
  },
});
