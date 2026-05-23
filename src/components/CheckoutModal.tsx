import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { formatUZS, products } from "@/lib/products";
import { useMemo, useState } from "react";
import { MapPin, Clock, Check, Phone } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { sendOrder } from "@/lib/telegram.functions";

export function CheckoutModal() {
  const { t } = useI18n();
  const { checkoutOpen, setCheckoutOpen, items, address, phone, setAddressOpen, setLoginOpen, clear } = useApp();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitOrder = useServerFn(sendOrder);

  const total = useMemo(() => {
    const subtotal = items.reduce((s, i) => {
      const p = products.find((pp) => pp.id === i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
    const delivery = subtotal > 0 && subtotal < 100000 ? 15000 : 0;
    return { subtotal, delivery, total: subtotal + delivery };
  }, [items]);

  const submit = async () => {
    if (!phone) { setLoginOpen(true); return; }
    if (!address) { setAddressOpen(true); return; }
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => {
        const p = products.find((pp) => pp.id === i.id)!;
        return { name: p.name, qty: i.qty, price: p.price };
      });
      const res = await submitOrder({
        data: {
          phone,
          address: address.formatted,
          entrance: address.entrance ?? "",
          lat: address.lat,
          lng: address.lng,
          note,
          items: orderItems,
          subtotal: total.subtotal,
          delivery: total.delivery,
          total: total.total,
        },
      });
      toast.success(`${t("checkout.success")} (${res.orderId})`);
      clear();
      setCheckoutOpen(false);
      setNote("");
    } catch (e) {
      console.error(e);
      toast.error("Buyurtmani yuborib bo'lmadi. Qaytadan urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6 pb-3 border-b">
          <DialogTitle className="font-display text-2xl">{t("checkout.title")}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          <button
            onClick={() => setAddressOpen(true)}
            className="w-full flex items-start gap-3 p-3 bg-muted/50 hover:bg-muted rounded-xl text-left transition"
          >
            <MapPin className="size-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">{t("checkout.delivery")}</div>
              <div className="font-medium truncate">{address?.formatted ?? t("addr.set")}</div>
              {address?.entrance && <div className="text-xs text-muted-foreground">{address.entrance}</div>}
            </div>
          </button>

          <button
            onClick={() => setLoginOpen(true)}
            className="w-full flex items-start gap-3 p-3 bg-muted/50 hover:bg-muted rounded-xl text-left transition"
          >
            <Phone className="size-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">{t("login.phone")}</div>
              <div className="font-medium truncate">{phone ?? t("header.login")}</div>
            </div>
          </button>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <Clock className="size-5 text-primary shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">{t("checkout.time")}</div>
              <div className="font-medium">{t("checkout.time.fast")}</div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">{t("checkout.note")}</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="border-t pt-3 space-y-1.5">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("cart.subtotal")}</span><span>{formatUZS(total.subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("cart.delivery")}</span><span>{total.delivery === 0 ? t("cart.delivery.free") : formatUZS(total.delivery)}</span></div>
            <div className="flex justify-between font-display text-2xl pt-1"><span>{t("cart.total")}</span><span className="text-primary">{formatUZS(total.total)}</span></div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <Button
            onClick={submit}
            disabled={submitting || items.length === 0}
            size="lg"
            className="w-full brand-gradient text-brand-foreground hover:opacity-90 shadow-[var(--shadow-glow)]"
          >
            <Check className="size-4 mr-1" /> {t("checkout.submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
