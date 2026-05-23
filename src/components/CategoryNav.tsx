import { useI18n } from "@/lib/i18n";
import { categoryOrder, type Category } from "@/lib/products";
import { Beef, Drumstick, Pizza, IceCream, Sandwich, CupSoda, Flame, Soup } from "lucide-react";

const icons: Record<Category, typeof Flame> = {
  popular: Flame,
  burgers: Beef,
  chicken: Drumstick,
  pizza: Pizza,
  lavash: Wrap,
  snacks: Sandwich,
  drinks: CupSoda,
  dessert: IceCream,
};

export function CategoryNav({ active, onSelect }: { active: Category; onSelect: (c: Category) => void }) {
  const { t } = useI18n();
  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
          {categoryOrder.map((c) => {
            const Icon = icons[c];
            const isActive = active === c;
            return (
              <button
                key={c}
                onClick={() => onSelect(c)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive ? "brand-gradient text-brand-foreground shadow-[var(--shadow-glow)]" : "bg-muted hover:bg-secondary text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {t(`cat.${c}` as const)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
