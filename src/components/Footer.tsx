import { useI18n } from "@/lib/i18n";
import { Instagram, Facebook, Send } from "lucide-react";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-brand-dark text-white mt-16">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="brand-gradient text-brand-foreground font-display text-2xl px-3 py-1 rounded-md tracking-wider">OLOV</div>
            <span className="font-display text-2xl tracking-wider">FOOD</span>
          </div>
          <p className="text-white/70 text-sm max-w-sm">{t("footer.tag")}</p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 bg-white/10 hover:bg-primary rounded-full transition-colors"><Instagram className="size-4" /></a>
            <a href="#" className="p-2 bg-white/10 hover:bg-primary rounded-full transition-colors"><Facebook className="size-4" /></a>
            <a href="#" className="p-2 bg-white/10 hover:bg-primary rounded-full transition-colors"><Send className="size-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">{t("nav.menu")}</h4>
          <ul className="space-y-1.5 text-sm text-white/70">
            <li>{t("cat.burgers")}</li>
            <li>{t("cat.chicken")}</li>
            <li>{t("cat.pizza")}</li>
            <li>{t("cat.drinks")}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">{t("nav.contacts")}</h4>
          <ul className="space-y-1.5 text-sm text-white/70">
            <li>+998 71 200-00-00</li>
            <li>info@fastbite.uz</li>
            <li>Toshkent, Amir Temur 1</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} FastBite. {t("footer.rights")}.
        </div>
      </div>
    </footer>
  );
}
