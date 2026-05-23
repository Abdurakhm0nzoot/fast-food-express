import { Link } from "@tanstack/react-router";
import { MapPin, ShoppingBag, User, ChevronDown, LogOut, ClipboardList, X } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMemo, useState } from "react";

const langs: { code: Lang; label: string; flag: string }[] = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { phone, address, items, setCartOpen, setLoginOpen, setAddressOpen, setPhone } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);

  const itemsCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const current = langs.find((l) => l.code === lang)!;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-4 h-16 flex items-center gap-3 md:gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="brand-gradient text-brand-foreground font-display text-xl px-3 py-1 rounded-md tracking-wider">
            OLOV
          </div>
          <span className="hidden sm:inline font-display text-xl tracking-wider text-brand-dark">FOOD</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-foreground/80">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">{t("nav.menu")}</Link>
          <Link to="/about" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">{t("nav.about")}</Link>
          <Link to="/branches" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">{t("nav.branches")}</Link>
          <Link to="/contacts" activeProps={{ className: "text-primary" }} className="hover:text-primary transition-colors">{t("nav.contacts")}</Link>
        </nav>

        <button
          onClick={() => setAddressOpen(true)}
          className="ml-auto md:ml-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-secondary transition-colors text-sm max-w-[180px] md:max-w-[260px]"
        >
          <MapPin className="size-4 text-primary shrink-0" />
          <span className="truncate text-left">
            {address?.formatted || t("header.address")}
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-secondary transition-colors text-sm"
          >
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline">{t("header.cart")}</span>
            {itemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-[10px] min-w-[18px] h-[18px] px-1 flex items-center justify-center font-bold">
                {itemsCount}
              </span>
            )}
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1 px-2 py-2 rounded-lg bg-muted hover:bg-secondary transition-colors text-sm">
                <span>{current.flag}</span>
                <ChevronDown className="size-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="end">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted ${l.code === lang ? "bg-muted font-semibold" : ""}`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {phone ? (
            <Popover open={profileOpen} onOpenChange={setProfileOpen}>
              <PopoverTrigger asChild>
                <button className="brand-gradient text-brand-foreground p-2 rounded-lg hover:opacity-90 transition-opacity">
                  <User className="size-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1" align="end">
                <div className="px-3 py-2 text-sm font-medium border-b mb-1">{phone}</div>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted">
                  <User className="size-4" /> {t("header.profile")}
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted">
                  <ClipboardList className="size-4" /> {t("header.myorders")}
                </button>
                <button
                  onClick={() => { setPhone(null); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted text-primary"
                >
                  <LogOut className="size-4" /> {t("header.logout")}
                </button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button onClick={() => setLoginOpen(true)} size="sm" className="brand-gradient text-brand-foreground hover:opacity-90">
              {t("header.login")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
