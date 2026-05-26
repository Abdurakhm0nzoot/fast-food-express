import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, Clock, ChefHat, Truck, PackageCheck, XCircle, MapPin, Phone, ArrowLeft } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getCustomerBotUsername } from "@/lib/orders.functions";

type OrderRow = {
  id: string;
  order_code: string;
  phone: string;
  address: string;
  entrance: string | null;
  lat: number | null;
  lng: number | null;
  status: "new" | "accepted" | "preparing" | "on_way" | "delivered" | "cancelled";
  items: Array<{ name: string; qty: number; price: number }>;
  subtotal: number;
  delivery: number;
  total: number;
  customer_chat_id: number | null;
  created_at: string;
};

const STEPS: { key: OrderRow["status"]; label: string; icon: any }[] = [
  { key: "new", label: "Kutilmoqda", icon: Clock },
  { key: "accepted", label: "Qabul qilindi", icon: Check },
  { key: "preparing", label: "Tayyorlanmoqda", icon: ChefHat },
  { key: "on_way", label: "Yo'lda", icon: Truck },
  { key: "delivered", label: "Yetkazildi", icon: PackageCheck },
];

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " so'm";
}

export const Route = createFileRoute("/order/$code")({
  head: ({ params }) => ({
    meta: [{ title: `Buyurtma ${params.code} — OlovFood` }],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { code } = useParams({ from: "/order/$code" });
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [botUsername, setBotUsername] = useState<string | null>(null);
  const fetchBot = useServerFn(getCustomerBotUsername);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("order_code", code)
        .maybeSingle();
      if (active) {
        setOrder(data as OrderRow | null);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [code]);

  useEffect(() => {
    fetchBot().then((r) => setBotUsername(r.username)).catch(() => {});
  }, [fetchBot]);

  // Realtime subscription
  useEffect(() => {
    if (!order) return;
    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${order.id}` },
        (payload) => {
          setOrder((prev) => (prev ? { ...prev, ...(payload.new as OrderRow) } : prev));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Yuklanmoqda…</div>;
  }
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-display text-3xl">Buyurtma topilmadi</h1>
        <p className="text-muted-foreground">Kod: {code}</p>
        <Link to="/" className="text-primary underline">Bosh sahifa</Link>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const activeIdx = isCancelled ? -1 : STEPS.findIndex((s) => s.key === order.status);
  const trackUrl = botUsername ? `https://t.me/${botUsername}?start=order_${order.order_code}` : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Bosh sahifa
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Buyurtma raqami</p>
          <h1 className="font-display text-4xl text-primary">{order.order_code}</h1>
        </div>

        {isCancelled ? (
          <div className="bg-destructive/10 text-destructive rounded-2xl p-6 text-center flex flex-col items-center gap-2">
            <XCircle className="size-10" />
            <p className="font-semibold">Buyurtma bekor qilindi</p>
            <p className="text-sm">Batafsil: +998 90 000 00 00</p>
          </div>
        ) : (
          <div className="bg-card border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i <= activeIdx;
                const active = i === activeIdx;
                return (
                  <div key={s.key} className="flex flex-col items-center gap-1 flex-1 relative">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center transition-all ${
                        done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      } ${active ? "ring-4 ring-primary/30 scale-110" : ""}`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span className={`text-[10px] sm:text-xs text-center ${done ? "font-semibold" : "text-muted-foreground"}`}>
                      {s.label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-0 ${i < activeIdx ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {trackUrl && !order.customer_chat_id && !isCancelled && (
          <a
            href={trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#229ED9] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
          >
            📱 Telegram orqali kuzatish
          </a>
        )}
        {order.customer_chat_id && (
          <div className="bg-green-500/10 text-green-700 dark:text-green-400 rounded-xl p-3 text-sm text-center">
            ✅ Telegram orqali ulangansiz — status o'zgarsa xabar olasiz
          </div>
        )}

        <div className="bg-card border rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold">Yetkazish</h2>
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="size-4 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <div>{order.address}</div>
              {order.entrance && <div className="text-muted-foreground text-xs">{order.entrance}</div>}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="size-4 text-primary shrink-0" />
            <span>{order.phone}</span>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold">Mahsulotlar</h2>
          <div className="space-y-2 text-sm">
            {order.items.map((it, i) => (
              <div key={i} className="flex justify-between">
                <span>{it.name} × {it.qty}</span>
                <span className="font-medium">{fmt(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Yetkazish</span><span>{order.delivery === 0 ? "Bepul" : fmt(order.delivery)}</span></div>
            <div className="flex justify-between font-display text-xl pt-1"><span>Jami</span><span className="text-primary">{fmt(order.total)}</span></div>
          </div>
        </div>
      </main>
    </div>
  );
}
