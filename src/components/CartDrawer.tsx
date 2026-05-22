import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { formatUZS, products } from "@/lib/products";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo } from "react";

export function CartDrawer() {
  const { lang, t } = useI18n();
  const { cartOpen, setCartOpen, items, setQty, remove, setCheckoutOpen } = useApp();

  const detailed = useMemo(
    () => items.map((i) => ({ ...i, product: products.find((p) => p.id === i.id)! })).filter((x) => x.product),
    [items],
  );
  const subtotal = detailed.reduce((s, i) => s + i.product.price * i.qty, 0);
  const delivery = subtotal > 0 && subtotal < 100000 ? 15000 : 0;
  const total = subtotal + delivery;

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-5 py-4 border-b">
          <SheetTitle className="font-display text-2xl">{t("cart.title")}</SheetTitle>
        </SheetHeader>

        {detailed.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingBag className="size-16 text-muted-foreground/50 mb-4" />
            <p className="font-display text-2xl">{t("cart.empty")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("cart.empty.sub")}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              {detailed.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 bg-muted/50 rounded-xl p-3">
                  <img src={product.image} alt="" width={72} height={72} className="size-18 w-18 h-18 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <h4 className="font-semibold text-sm leading-tight">{product.name[lang]}</h4>
                      <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-primary shrink-0">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{formatUZS(product.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-card rounded-full p-1">
                        <button onClick={() => setQty(product.id, qty - 1)} className="size-7 rounded-full bg-muted hover:bg-secondary flex items-center justify-center">
                          <Minus className="size-3" />
                        </button>
                        <span className="font-bold w-6 text-center text-sm">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} className="size-7 rounded-full brand-gradient text-brand-foreground flex items-center justify-center">
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="font-semibold text-primary text-sm">{formatUZS(product.price * qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-5 space-y-2 bg-muted/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                <span>{formatUZS(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("cart.delivery")}</span>
                <span>{delivery === 0 ? t("cart.delivery.free") : formatUZS(delivery)}</span>
              </div>
              <div className="flex justify-between font-display text-2xl pt-2 border-t">
                <span>{t("cart.total")}</span>
                <span className="text-primary">{formatUZS(total)}</span>
              </div>
              <Button
                onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                size="lg"
                className="w-full brand-gradient text-brand-foreground hover:opacity-90 shadow-[var(--shadow-glow)]"
              >
                {t("cart.checkout")} →
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
