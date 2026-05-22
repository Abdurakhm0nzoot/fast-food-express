import { useI18n } from "@/lib/i18n";
import { formatUZS, type Product } from "@/lib/products";
import { useApp } from "@/lib/store";
import { Plus, Minus } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useI18n();
  const { items, add, setQty } = useApp();
  const inCart = items.find((i) => i.id === product.id);

  return (
    <article className="group bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative aspect-square bg-secondary overflow-hidden">
        <img
          src={product.image}
          alt={product.name[lang]}
          loading="lazy"
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.oldPrice && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base leading-tight mb-1">{product.name[lang]}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{product.desc[lang]}</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatUZS(product.oldPrice)}</span>
            )}
            <span className="font-display text-xl text-primary">{formatUZS(product.price)}</span>
          </div>
          {inCart ? (
            <div className="flex items-center gap-1 bg-muted rounded-full p-1">
              <button onClick={() => setQty(product.id, inCart.qty - 1)} className="size-8 rounded-full bg-card hover:bg-secondary flex items-center justify-center">
                <Minus className="size-3" />
              </button>
              <span className="font-bold w-6 text-center text-sm">{inCart.qty}</span>
              <button onClick={() => setQty(product.id, inCart.qty + 1)} className="size-8 rounded-full brand-gradient text-brand-foreground flex items-center justify-center">
                <Plus className="size-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => add(product)}
              className="brand-gradient text-brand-foreground font-semibold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity flex items-center gap-1"
            >
              <Plus className="size-4" /> {t("product.add")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
