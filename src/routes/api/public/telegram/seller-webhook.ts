import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "crypto";
import { handleMessage, handleCallback } from "@/lib/bot-flow.server";

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

export const Route = createFileRoute("/api/public/telegram/seller-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const actual = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        if (!safeEqual(actual, webhookSecret())) {
          return new Response("Unauthorized", { status: 401 });
        }
        const update = (await request.json()) as any;
        try {
          if (update.callback_query) {
            await handleCallback(update.callback_query);
          } else if (update.message) {
            await handleMessage(update.message);
          }
        } catch (e) {
          console.error("seller-webhook error", e);
        }
        return Response.json({ ok: true });
      },
      GET: async () => Response.json({ ok: true, bot: "OlovFood Customer" }),
    },
  },
});
