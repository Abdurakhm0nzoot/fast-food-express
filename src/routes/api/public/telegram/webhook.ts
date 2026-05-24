import { createFileRoute } from "@tanstack/react-router";
import { sendTelegramMessage } from "@/lib/telegram.functions";
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
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  return createHash("sha256").update(`olovfood-webhook:${token}`).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/telegram/webhook")({
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
          const name = message.from?.first_name ?? message.from?.username ?? "admin";
          const chatName = message.chat?.title ? `\nГуруҳ: ${escapeHtml(message.chat.title)}` : "";
          await sendTelegramMessage(
            chatId,
            `🔥 <b>OlovFood bot tayyor</b>\n\nSalom, ${escapeHtml(name)}!\n\nChat ID: <code>${chatId}</code>${chatName}\n\nShu ID ni <b>TELEGRAM_ADMIN_CHAT_ID</b> ga qo'ying. Keyin buyurtmalar shu chatga keladi.`,
          );
        }

        return Response.json({ ok: true });
      },
      GET: async () => Response.json({ ok: true, bot: "OlovFood" }),
    },
  },
});