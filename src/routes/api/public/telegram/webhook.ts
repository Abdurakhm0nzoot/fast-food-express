// Admin bot webhook — receives messages AND callback_query (status buttons)
import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "crypto";
import {
  supabaseAdmin,
  tgRequest,
  updateAdminMessage,
  notifyCustomer,
  STATUS_LABEL,
  type OrderStatus,
} from "@/lib/orders.server";

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

const ALLOWED_STATUSES: OrderStatus[] = ["accepted", "preparing", "on_way", "delivered", "cancelled"];

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const actualSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        if (!safeEqual(actualSecret, webhookSecret())) {
          return new Response("Unauthorized", { status: 401 });
        }

        const update = (await request.json()) as any;
        const token = process.env.TELEGRAM_BOT_TOKEN!;

        // Handle inline button clicks
        if (update.callback_query) {
          const cq = update.callback_query;
          const data: string = cq.data ?? "";
          if (data === "noop") {
            await tgRequest(token, "answerCallbackQuery", { callback_query_id: cq.id });
            return Response.json({ ok: true });
          }
          const parts = data.split(":");
          if (parts[0] !== "s" || parts.length !== 3) {
            await tgRequest(token, "answerCallbackQuery", { callback_query_id: cq.id });
            return Response.json({ ok: true });
          }
          const [, orderCode, newStatus] = parts;
          if (!ALLOWED_STATUSES.includes(newStatus as OrderStatus)) {
            await tgRequest(token, "answerCallbackQuery", {
              callback_query_id: cq.id,
              text: "Noto'g'ri status",
            });
            return Response.json({ ok: true });
          }

          // Update DB
          const { data: updated, error } = await supabaseAdmin
            .from("orders")
            .update({ status: newStatus as OrderStatus })
            .eq("order_code", orderCode)
            .select("*")
            .single();

          if (error || !updated) {
            await tgRequest(token, "answerCallbackQuery", {
              callback_query_id: cq.id,
              text: "Buyurtma topilmadi",
            });
            return Response.json({ ok: true });
          }

          await tgRequest(token, "answerCallbackQuery", {
            callback_query_id: cq.id,
            text: `Status: ${STATUS_LABEL[newStatus as OrderStatus]}`,
          });

          // Update admin message + notify customer in parallel
          await Promise.all([
            updateAdminMessage(updated),
            notifyCustomer(updated),
          ]);

          return Response.json({ ok: true });
        }

        // Handle plain messages (/start etc)
        const message = update.message;
        const chatId = message?.chat?.id;
        const text = message?.text?.trim();

        if (!chatId || !text) {
          return Response.json({ ok: true, ignored: true });
        }

        if (text === "/start" || text.startsWith("/start@")) {
          const name = message.from?.first_name ?? message.from?.username ?? "admin";
          const chatName = message.chat?.title ? `\nГуруҳ: ${escapeHtml(message.chat.title)}` : "";
          await tgRequest(token, "sendMessage", {
            chat_id: chatId,
            text: `🔥 <b>OlovFood admin bot</b>\n\nSalom, ${escapeHtml(name)}!\n\nChat ID: <code>${chatId}</code>${chatName}\n\nShu ID ni <b>TELEGRAM_ADMIN_CHAT_ID</b> ga qo'ying. Buyurtmalar shu chatga keladi, statusni tugmalar orqali yangilang.`,
            parse_mode: "HTML",
          });
        }

        return Response.json({ ok: true });
      },
      GET: async () => Response.json({ ok: true, bot: "OlovFood Admin" }),
    },
  },
});
